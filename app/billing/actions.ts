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

export async function createCheckoutSession(priceId: string) {
    const session = await auth();

    // 1. Auth Guard
    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/billing`);
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // 2. Logic: Check if user already has a subscription record
    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });

    // 3. Logic: Prepare Stripe Metadata
    // We reuse the customerId if it exists to prevent duplicate Stripe customers
    const customerId = existingSub?.stripeCustomerId;
    // 4. Logic: Create a Stripe Checkout Session
    let url: string | null = null;

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId || undefined,
            // If we don't have a customerId, Stripe will create one using this email
            customer_email: customerId ? undefined : userEmail!,
            client_reference_id: userId,
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
            metadata: {
                userId: userId, // Very important for the Webhook to link the payment to the user
            },
        });
        url = checkoutSession.url;
    } catch (error) {
        console.error("[STRIPE_SESSION_ERROR]:", error);
        throw error;
    }
    // 5. Redirect the user to the Stripe Checkout page
    if (url) redirect(url);
}

export async function createPortalSession() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect(`/login`);
    }

    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    // Logic: If they don't have a Stripe ID, they can't use the portal
    if (!existingSub?.stripeCustomerId) {
        redirect("/billing");
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: existingSub.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        });

        redirect(portalSession.url);
    } catch (error) {
        console.error("[PORTAL_ERROR]:", error);
        redirect("/billing?error=portal_failed");
    }
}
