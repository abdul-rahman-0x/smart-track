"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { createCheckoutSession } from "@/app/billing/actions";

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    // We are gating under the two requested plans: Free & Pro (with 20% off yearly toggle)
    const proPrice = isYearly ? 2.4 : 3.0; // 20% off $3/mo on yearly billing
    const proPriceId = isYearly
        ? "price_your_yearly_stripe_price_id"
        : "price_1ThUMyQ1vNDl9oKo21feyFzG";

    const handleProUpgrade = async () => {
        await createCheckoutSession(proPriceId);
    };

    return (
        <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-4">
                <h3 className="text-3xl font-extrabold tracking-tight">
                    Choose Your Plan. Start Planning Today.
                </h3>
                <p className="text-sm text-stone-500">
                    Transparent pricing for every student. Scale as your
                    workload grows.
                </p>

                {/* Monthly / Yearly Toggle */}
                <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                            !isYearly
                                ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                : "text-stone-500 hover:text-stone-900"
                        }`}>
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${
                            isYearly
                                ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                : "text-stone-500 hover:text-stone-900"
                        }`}>
                        Yearly
                        <span className="text-[10px] font-bold text-orange-500">
                            20% OFF
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
                {/* Free Plan Card */}
                <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                            Free
                        </span>
                        <div className="text-3xl font-extrabold">
                            $0
                            <span className="text-sm font-normal text-stone-400">
                                /month
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">
                            Perfect for beginners exploring digital
                            organization.
                        </p>
                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Max 2 daily Focus sessions
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Complete Habit Tracker
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                Standard Task Planner
                            </div>
                        </div>
                    </div>
                    <Button asChild className="w-full mt-6" variant="outline">
                        <a href="/login">Get Started</a>
                    </Button>
                </div>

                {/* Pro Plan Card */}
                <div className="p-6 bg-stone-950 border-2 border-orange-500 text-stone-100 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <span className="absolute top-4 right-4 text-[10px] font-bold text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full bg-orange-500/10">
                        POPULAR
                    </span>
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
                            Pro
                        </span>
                        <div className="text-3xl font-extrabold">
                            ${proPrice}
                            <span className="text-sm font-normal text-stone-400">
                                /month
                            </span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">
                            Advanced academic tools for dedicated students.
                        </p>
                        <div className="border-t border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />{" "}
                                Unlimited daily Focus sessions
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />{" "}
                                Google Calendar Integration
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />{" "}
                                Unlimited exams, habits, and tasks
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />{" "}
                                Priority task tags
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleProUpgrade}
                        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white border-none">
                        Get Pro Now
                    </Button>
                </div>
            </div>
        </section>
    );
}
