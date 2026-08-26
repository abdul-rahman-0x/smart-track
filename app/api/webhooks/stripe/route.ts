import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeApiKey || "");

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
    subscription: string | null;
    metadata: {
        userId?: string;
    } | null;
}

interface StripeInvoice {
    subscription: string | null;
}

const toSafeDate = (unixTimestamp: number | undefined | null): Date | null => {
    if (!unixTimestamp || !Number.isFinite(unixTimestamp) || unixTimestamp <= 0)
        return null;
    const date = new Date(unixTimestamp * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");

    if (!stripeApiKey || !stripeWebhookSecret || !signature) {
        return new NextResponse("Security Configuration Missing", {
            status: 400,
        });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            stripeWebhookSecret,
        );
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown Error";
        console.error("❌ Webhook Verification Failed:", msg);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data
                .object as unknown as StripeCheckoutSession;
            const userId = session.metadata?.userId;
            const subscriptionId = session.subscription;

            if (!userId || !subscriptionId)
                return new NextResponse(null, { status: 200 });

            const stripeSub =
                await stripe.subscriptions.retrieve(subscriptionId);
            const subscription = stripeSub as unknown as StripeSubscription;
            const expiryDate = toSafeDate(subscription.current_period_end);

            if (!expiryDate)
                return new NextResponse("Invalid Expiry", { status: 500 });

            await db
                .insert(subscriptions)
                .values({
                    userId,
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
                        status: subscription.status,
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    },
                });
            console.log(`✅ Provisioned Pro for: ${userId}`);
        }

        if (event.type === "invoice.payment_succeeded") {
            const invoice = event.data.object as unknown as StripeInvoice;
            if (!invoice.subscription)
                return new NextResponse(null, { status: 200 });

            const stripeSub = await stripe.subscriptions.retrieve(
                invoice.subscription,
            );
            const subscription = stripeSub as unknown as StripeSubscription;
            const expiryDate = toSafeDate(subscription.current_period_end);

            if (expiryDate) {
                await db
                    .update(subscriptions)
                    .set({
                        status: subscription.status,
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    })
                    .where(
                        eq(subscriptions.stripeSubscriptionId, subscription.id),
                    );
                console.log(`💳 Renewal Success: ${subscription.id}`);
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (err) {
        console.error("❌ Webhook Logic Failure:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
