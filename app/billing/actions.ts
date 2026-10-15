"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function createCheckoutSession(priceId?: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let targetPriceId = priceId || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  // --- AUTO-DETECT ACTIVE PRICE FROM STRIPE ---
  try {
    const prices = await stripe.prices.list({ active: true, limit: 10 });
    console.log(
      "Connected Stripe Account Prices:",
      prices.data.map((p) => ({
        id: p.id,
        amount: p.unit_amount ? p.unit_amount / 100 : 0,
        currency: p.currency,
      })),
    );

    // If the provided priceId is missing or doesn't exist in this account, auto-pick the first active price!
    const match = prices.data.find((p) => p.id === targetPriceId);
    if (!match && prices.data.length > 0) {
      targetPriceId = prices.data[0].id;
      console.log(`Auto-selected active Stripe price: ${targetPriceId}`);
    }
  } catch (err) {
    console.error("Error inspecting Stripe prices:", err);
  }

  if (!targetPriceId) {
    throw new Error("No active Stripe price found in this account.");
  }

  const existingSub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session.user.id),
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: existingSub?.stripeCustomerId || undefined,
    customer_email: existingSub?.stripeCustomerId
      ? undefined
      : session.user.email!,
    line_items: [{ price: targetPriceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${appUrl}/dashboard`,
    cancel_url: `${appUrl}/billing`,
    metadata: { userId: session.user.id },
    // Attach userId directly to the Stripe subscription object:
    subscription_data: {
      metadata: { userId: session.user.id },
    },
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

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/billing`,
  });

  if (portalSession.url) redirect(portalSession.url);
}
