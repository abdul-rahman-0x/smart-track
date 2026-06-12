"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(
    process.env.STRIPE_API_KEY || "sk_test_dummy_key_for_build",
);
// Action 1: Create a Stripe Checkout Session
export async function createCheckoutSession(priceId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/billing`);
    }

    const userId = session.user.id;

    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });

    const customerId = existingSub?.stripeCustomerId;

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId || undefined,
        customer_email: customerId ? undefined : session.user.email!,
        client_reference_id: userId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    redirect(checkoutSession.url!);
}

// Action 2: Load the Stripe Customer Portal
export async function createPortalSession() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect(`/login`);
    }

    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!existingSub?.stripeCustomerId) {
        redirect("/dashboard");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: existingSub.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    redirect(portalSession.url);
}
