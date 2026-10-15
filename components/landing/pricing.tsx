"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/app/billing/actions";

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);
    const [isPending, startTransition] = useTransition();

    // 1. Correct pricing math based on our $9/mo plan (20% off = $7.00/mo billed annually)
    const proPrice = isYearly ? 7.0 : 9.0;
    const proPriceId = isYearly
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    // 2. Resilient checkout initiation (preserves Next.js server action redirects)
    const handleProUpgrade = () => {
        if (!proPriceId) {
            console.error("Stripe Price ID is missing in environment variables.");
            return;
        }

        startTransition(async () => {
            try {
                await createCheckoutSession(proPriceId);
            } catch (error) {
                // If it's Next.js internal redirect, let it pass through to navigate
                if ((error as Error)?.message?.includes("NEXT_REDIRECT")) {
                    return;
                }
                console.error("Payment initiation failed:", error);
            }
        });
    };

    return (
        <section
            id="pricing"
            className="max-w-5xl mx-auto px-4 py-20 space-y-12">
            <div className="text-center space-y-4">
                <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-[1.1] text-stone-900 dark:text-white max-w-xl mx-auto">
                    Pick a plan, master your time
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                    Simple, transparent pricing built to scale your daily focus
                    as your workload grows.
                </p>

                <div className="flex justify-center pt-2">
                    <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setIsYearly(false)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${!isYearly
                                ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                }`}>
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsYearly(true)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${isYearly
                                ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                }`}>
                            Yearly
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
                {/* Free Plan Card */}
                <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-300">
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                            Free
                        </span>
                        <div className="text-3xl font-extrabold tracking-tight">
                            $0
                            <span className="text-sm font-normal text-stone-400 ml-1">
                                /month
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Perfect for beginners building baseline study routines.
                        </p>
                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Up to 3 active habit routines
                            </div>
                            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                1 active academic milestone
                            </div>
                            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                10 daily planner tasks
                            </div>
                            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Standard 25/5 Pomodoro timer
                            </div>
                        </div>
                    </div>
                    {/* Using Next.js Link instead of a standard <a> tag */}
                    <Button asChild className="w-full mt-6" variant="outline">
                        <Link href="/login">Get Started</Link>
                    </Button>
                </div>

                {/* Pro Plan Card */}
                <div className="p-6 bg-stone-950 border-2 border-emerald-500 text-stone-100 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
                    <span className="absolute top-4 right-4 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">
                        Most popular
                    </span>
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                            Pro
                        </span>
                        <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <span>${proPrice}</span>
                            <span className="text-sm font-normal text-stone-400">
                                /month
                            </span>
                            {isYearly && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Save 20%
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">
                            Full deep-work power with automated study tools.
                        </p>
                        <div className="border-t border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Unlimited habits & streak freeze
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Daily Syllabus Pacing Coach
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Unlimited tasks with Priority Queue
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Full 365-day consistency heatmap
                            </div>
                        </div>
                    </div>
                    <Button
                        disabled={isPending}
                        onClick={handleProUpgrade}
                        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-200 cursor-pointer">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting to Stripe...
                            </>
                        ) : (
                            "Get Pro Now"
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
}
