import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
    createCheckoutSession,
    createPortalSession,
} from "@/app/billing/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, CreditCard, Calendar } from "lucide-react";

export default async function BillingPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // Fetch the user's active subscription status from Neon
    const userSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });

    const isPro =
        userSub?.status === "active" || userSub?.status === "trialing";

    // Server actions wrapper
    const handleUpgrade = async () => {
        "use server";
        // Dynamically fetch from your new .env variables
        const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
        if (!priceId) {
            throw new Error(
                "Stripe Price ID is missing in Production environment.",
            );
        }
        await createCheckoutSession(priceId);
    };

    const handleManage = async () => {
        "use server";
        await createPortalSession();
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Billing & Membership
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Manage your account plan, billing cycles, and active
                    subscriptions.
                </p>
            </div>

            {/* --- SCENARIO 1: PRO SUBSCRIBER SCREEN --- */}
            {isPro ? (
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-6 rounded-2xl">
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                <Sparkles className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    Pro Plan Active
                                </h3>
                                <p className="text-xs text-stone-400">
                                    Premium academic scheduling unlocked.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3 text-xs text-stone-600 dark:text-stone-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-stone-400" />
                                <span>
                                    Renews on:{" "}
                                    <span className="font-bold">
                                        {userSub.currentPeriodEnd?.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <form action={handleManage}>
                            <Button type="submit" className="w-full flex gap-2">
                                <CreditCard className="w-4 h-4" /> Manage
                                Subscription on Stripe
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                /* --- SCENARIO 2: FREE USER UPGRADE SCREEN --- */
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-6 rounded-2xl">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                                Current Plan: Free
                            </span>
                            <h3 className="text-xl font-bold">
                                Ready to master your workflow?
                            </h3>
                            <p className="text-xs text-stone-500 leading-relaxed">
                                Upgrade to the Pro Plan for $3/month to unlock
                                advanced scheduling features and unlimited
                                progress tracking.
                            </p>
                        </div>

                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span>
                                    Unlimited daily Focus Pomodoro sessions
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span>Two-way Google Calendar Integration</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span>
                                    Unlimited exams, habits, and task slots
                                </span>
                            </div>
                        </div>

                        <form action={handleUpgrade}>
                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none flex gap-2">
                                <Sparkles className="w-4 h-4 fill-current" />{" "}
                                Upgrade to Pro for $3
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
