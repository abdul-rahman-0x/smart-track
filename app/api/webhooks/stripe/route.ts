import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

// Strictly defined payload interface to manage both sessions and subscription returns cleanly
interface StripePayload {
    id: string;
    customer?: string | null;
    subscription?: string | null;
    client_reference_id?: string | null;
    status?: string;
    current_period_end?: number;
    items?: {
        data: Array<{
            price: {
                id: string;
            };
        }>;
    };
}

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
        const errorMessage =
            err instanceof Error ? err.message : "Unknown webhook error";
        return new NextResponse(`Webhook Error: ${errorMessage}`, {
            status: 400,
        });
    }

    // 1. Cast the incoming event payload to our safe local interface
    const data = event.data.object as unknown as StripePayload;

    switch (event.type) {
        case "checkout.session.completed": {
            if (!data.client_reference_id) break;

            // 2. Cast retrieved subscription response to our local payload interface
            const subscriptionDetails = (await stripe.subscriptions.retrieve(
                data.subscription as string,
            )) as unknown as StripePayload;

            const periodEndEpoch = subscriptionDetails.current_period_end;

            if (!periodEndEpoch || !subscriptionDetails.items) break;

            await db.insert(subscriptions).values({
                userId: data.client_reference_id,
                stripeCustomerId: data.customer as string,
                stripeSubscriptionId: data.subscription as string,
                stripePriceId: subscriptionDetails.items.data[0].price.id,
                status: subscriptionDetails.status || "active",
                currentPeriodEnd: new Date(periodEndEpoch * 1000),
            });
            break;
        }

        case "invoice.payment_succeeded": {
            if (!data.subscription) break;

            // 3. Cast retrieved subscription response to our local payload interface
            const subscriptionDetails = (await stripe.subscriptions.retrieve(
                data.subscription,
            )) as unknown as StripePayload;

            const periodEndEpoch = subscriptionDetails.current_period_end;

            if (!periodEndEpoch) break;

            await db
                .update(subscriptions)
                .set({
                    status: subscriptionDetails.status || "active",
                    currentPeriodEnd: new Date(periodEndEpoch * 1000),
                    updatedAt: new Date(),
                })
                .where(
                    eq(subscriptions.stripeSubscriptionId, data.subscription),
                );
            break;
        }

        case "customer.subscription.updated": {
            const periodEndEpoch = data.current_period_end;

            if (!periodEndEpoch || !data.items) break;

            await db
                .update(subscriptions)
                .set({
                    status: data.status || "active",
                    stripePriceId: data.items.data[0].price.id,
                    currentPeriodEnd: new Date(periodEndEpoch * 1000),
                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.stripeSubscriptionId, data.id));
            break;
        }

        case "customer.subscription.deleted": {
            await db
                .update(subscriptions)
                .set({
                    status: "canceled",
                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.stripeSubscriptionId, data.id));
            break;
        }
    }

    return new NextResponse(null, { status: 200 });
}
