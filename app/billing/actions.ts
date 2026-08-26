"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function createCheckoutSession(priceId: string) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const existingSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: existingSub?.stripeCustomerId || undefined,
        customer_email: existingSub?.stripeCustomerId
            ? undefined
            : session.user.email!,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
        metadata: { userId: session.user.id },
    });

    if (checkoutSession.url) redirect(checkoutSession.url);
}

export async function createPortalSession() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!sub?.stripeCustomerId) redirect("/billing");

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: sub.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    if (portalSession.url) redirect(portalSession.url);
}
