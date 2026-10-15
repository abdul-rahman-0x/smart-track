import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: Request) {
    const stripeApiKey = process.env.STRIPE_API_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeApiKey || !stripeWebhookSecret) {
        console.error("❌ Stripe credentials missing in environment variables.");
        return new NextResponse("Security Configuration Missing", { status: 400 });
    }

    const stripe = new Stripe(stripeApiKey);

    const body = await req.text();
    const headerPayload = await headers();
    const signature =
        req.headers.get("stripe-signature") ||
        headerPayload.get("stripe-signature") ||
        headerPayload.get("Stripe-Signature");

    if (!signature) {
        console.error("❌ Missing stripe-signature header.");
        return new NextResponse("Missing Signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown Error";
        console.error("❌ Webhook Signature Verification Failed:", msg);
        return new NextResponse(`Webhook Error: ${msg}`, { status: 400 });
    }

    console.log(`🔔 Stripe Webhook Received: [${event.type}]`);

    try {
        // --- EVENT 1: Initial Checkout Completed ---
        if (event.type === "checkout.session.completed") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const session = event.data.object as any;
            const userId = session.metadata?.userId;
            const subscriptionId =
                typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription?.id;

            if (!userId || !subscriptionId) {
                console.warn("⚠️ Missing userId or subscriptionId in checkout.session.completed:", {
                    userId,
                    subscriptionId,
                });
                return new NextResponse(null, { status: 200 });
            }

            // Retrieve the active subscription details from Stripe
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stripeSub = (await stripe.subscriptions.retrieve(subscriptionId)) as any;

            const customerId =
                typeof stripeSub.customer === "string"
                    ? stripeSub.customer
                    : stripeSub.customer?.id;

            const priceId =
                stripeSub.items?.data?.[0]?.price?.id ||
                process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ||
                "";

            // Support both modern Stripe API (items.data[0].current_period_end) and legacy (root current_period_end)
            const rawPeriodEnd =
                stripeSub.current_period_end ??
                stripeSub.items?.data?.[0]?.current_period_end;

            const expiryDate = rawPeriodEnd
                ? new Date(rawPeriodEnd * 1000)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            await db
                .insert(subscriptions)
                .values({
                    userId,
                    stripeCustomerId: customerId,
                    stripeSubscriptionId: stripeSub.id,
                    stripePriceId: priceId,
                    status: stripeSub.status || "active",
                    currentPeriodEnd: expiryDate,
                })
                .onConflictDoUpdate({
                    target: subscriptions.userId,
                    set: {
                        stripeSubscriptionId: stripeSub.id,
                        status: stripeSub.status || "active",
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    },
                });

            console.log(`✅ Provisioned Pro Plan successfully for User: ${userId}`);
        }

        // --- EVENT 2: Monthly Renewal Payment Succeeded ---
        if (event.type === "invoice.payment_succeeded") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const invoice = event.data.object as any;

            // Support modern Stripe API (invoice.parent.subscription_details.subscription) and legacy (invoice.subscription)
            const subscriptionId =
                typeof invoice.subscription === "string"
                    ? invoice.subscription
                    : invoice.parent?.subscription_details?.subscription ?? null;

            if (subscriptionId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const stripeSub = (await stripe.subscriptions.retrieve(subscriptionId)) as any;
                const rawPeriodEnd =
                    stripeSub.current_period_end ??
                    stripeSub.items?.data?.[0]?.current_period_end;

                const expiryDate = rawPeriodEnd
                    ? new Date(rawPeriodEnd * 1000)
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                await db
                    .update(subscriptions)
                    .set({
                        status: stripeSub.status || "active",
                        currentPeriodEnd: expiryDate,
                        updatedAt: new Date(),
                    })
                    .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id));

                console.log(`💳 Subscription Renewal Synced: ${stripeSub.id}`);
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (err) {
        console.error("❌ Webhook Database Insertion Error:", err);
        return new NextResponse("Database Write Error", { status: 500 });
    }
}
