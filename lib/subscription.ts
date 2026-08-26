import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export const getSubscriptionPlan = async () => {
    const session = await auth();
    if (!session?.user?.id) return { isPro: false };

    const data = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, session.user.id),
    });

    if (!data) return { isPro: false };

    const isPro =
        data.status === "active" &&
        data.currentPeriodEnd.getTime() + 86_400_000 > Date.now();

    return {
        ...data,
        isPro,
    };
};
