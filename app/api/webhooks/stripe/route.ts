import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(
    process.env.STRIPE_API_KEY || "sk_test_dummy_key_for_build",
);

// --- STRICT INTERFACES ---
interface StripeSubscription {
    id: string;
    customer: string;
    status: Stripe.Subscription.Status;
    current_period_end: number;
    items: {
        data: Array<{
            price: {
                id: string;
            };
        }>;
    };
}

interface StripeCheckoutSession {
    id: string;
    subscription: string | null;
    customer: string | null;
    metadata: {
        userId?: string;
    } | null;
}

interface StripeInvoice {
    subscription: string | null;
}

// --- HELPER: SAFE DATE CONVERSION ---
const toSafeDate = (unixTimestamp: number | undefined | null): Date => {
    if (!unixTimestamp || isNaN(unixTimestamp)) {
        console.error("❌ Invalid timestamp received:", unixTimestamp);
        // Fallback to 30 days from now if Stripe fails to provide a date
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    return new Date(unixTimestamp * 1000);
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse("Security Config Missing", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
    }

    try {
        // --- CASE 1: INITIAL PURCHASE ---
        if (event.type === "checkout.session.completed") {
            const session = event.data
                .object as unknown as StripeCheckoutSession;
            const userId = session.metadata?.userId;
            const subscriptionId = session.subscription;

            if (!userId || !subscriptionId) {
                console.error(
                    "❌ Webhook Error: Missing userId or subscriptionId",
                );
                return new NextResponse(null, { status: 200 });
            }

            // Fetch the subscription to get the period end and price ID
            const subData = await stripe.subscriptions.retrieve(subscriptionId);
            const subscription = subData as unknown as StripeSubscription;

            const expiryDate = toSafeDate(subscription.current_period_end);
            console.log(
                `⏳ Expiry calculated for ${userId}:`,
                expiryDate.toISOString(),
            );

            await db
                .insert(subscriptions)
                .values({
                    userId: userId,
                    stripeCustomerId: subscription.customer,
                    stripeSubscriptionId: subscription.id,
                    stripePriceId: subscription.items.data[0].price.id,
                    status: subscription.status,
                    currentPeriodEnd: expiryDate,
                })
                .onConflictDoUpdate({
                    target: subscriptions.userId,
                    set: {
                        stripeSubscriptionId: subscription.id,
                        stripePriceId: subscription.items.data[0].price.id,
                        status: subscription.status,
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    },
                });

            console.log(`✅ Neon DB Synced for user: ${userId}`);
        }

        // --- CASE 2: SUCCESSFUL RENEWAL ---
        if (event.type === "invoice.payment_succeeded") {
            const invoice = event.data.object as unknown as StripeInvoice;
            const subscriptionId = invoice.subscription;

            if (subscriptionId) {
                const subData =
                    await stripe.subscriptions.retrieve(subscriptionId);
                const subscription = subData as unknown as StripeSubscription;
                const expiryDate = toSafeDate(subscription.current_period_end);

                await db
                    .update(subscriptions)
                    .set({
                        status: subscription.status,
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    })
                    .where(
                        eq(subscriptions.stripeSubscriptionId, subscriptionId),
                    );

                console.log(
                    `💳 Invoice Paid. New Expiry: ${expiryDate.toISOString()}`,
                );
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("❌ WEBHOOK CRITICAL FAILURE:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
