import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2025-01-01" as Stripe.StripeConfig["apiVersion"],
});

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err: unknown) {
        // FIXED: Replaced catch block 'any' with a robust TypeScript type-guard
        const errorMessage =
            err instanceof Error ? err.message : "Unknown webhook error";
        return new NextResponse(`Webhook Error: ${errorMessage}`, {
            status: 400,
        });
    }

    const session = event.data.object as
        | Stripe.Checkout.Session
        | Stripe.Subscription;

    switch (event.type) {
        case "checkout.session.completed": {
            const checkoutSession = session as Stripe.Checkout.Session;
            if (!checkoutSession.client_reference_id) break;

            const subscriptionDetails = await stripe.subscriptions.retrieve(
                checkoutSession.subscription as string,
            );

            await db.insert(subscriptions).values({
                userId: checkoutSession.client_reference_id,
                stripeCustomerId: checkoutSession.customer as string,
                stripeSubscriptionId: checkoutSession.subscription as string,
                stripePriceId: subscriptionDetails.items.data[0].price.id,
                status: subscriptionDetails.status,
                currentPeriodEnd: new Date(
                    subscriptionDetails.current_period_end * 1000,
                ),
            });
            break;
        }

        case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            if (!invoice.subscription) break;

            const subscriptionDetails = await stripe.subscriptions.retrieve(
                invoice.subscription as string,
            );

            await db
                .update(subscriptions)
                .set({
                    status: subscriptionDetails.status,
                    currentPeriodEnd: new Date(
                        subscriptionDetails.current_period_end * 1000,
                    ),
                    updatedAt: new Date(),
                })
                .where(
                    eq(
                        subscriptions.stripeSubscriptionId,
                        invoice.subscription as string,
                    ),
                );
            break;
        }

        case "customer.subscription.updated": {
            const sub = session as Stripe.Subscription;

            await db
                .update(subscriptions)
                .set({
                    status: sub.status,
                    stripePriceId: sub.items.data[0].price.id,
                    currentPeriodEnd: new Date(sub.current_period_end * 1000),
                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.stripeSubscriptionId, sub.id));
            break;
        }

        case "customer.subscription.deleted": {
            const sub = session as Stripe.Subscription;

            await db
                .update(subscriptions)
                .set({
                    status: "canceled",
                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.stripeSubscriptionId, sub.id));
            break;
        }
    }

    return new NextResponse(null, { status: 200 });
}
