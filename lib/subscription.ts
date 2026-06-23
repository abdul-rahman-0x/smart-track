import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

const DAY_IN_MS = 86_400_000;

export const getSubscriptionPlan = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return { isPro: false };
    }

    const userSubscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!userSubscription) {
        return { isPro: false };
    }

    const isValid =
        userSubscription.stripePriceId &&
        userSubscription.currentPeriodEnd &&
        userSubscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return {
        ...userSubscription,
        isPro: !!isValid,
    };
};
