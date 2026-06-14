"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { createCheckoutSession } from "@/app/billing/actions";
import { SectionBadge } from "@/components/section-badge";

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

    // Dynamic price switching linked to your Stripe action
    const proPrice = isYearly ? 2.4 : 3.0; // 20% off $3/mo on yearly billing
    const proPriceId = isYearly
        ? "price_your_yearly_stripe_price_id"
        : "price_1ThUMyQ1vNDl9oKo21feyFzG";

    const handleProUpgrade = async () => {
        await createCheckoutSession(proPriceId);
    };

    return (
        <section className="max-w-5xl mx-auto px-4 py-20 space-y-12">
            {/* --- SECTION HEADER --- */}
            <div className="text-center space-y-4">
                <SectionBadge>Pricing</SectionBadge>

                <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-[1.1] text-stone-900 dark:text-white max-w-xl mx-auto">
                    Pick a plan, master your time
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                    Simple, transparent pricing built to scale your daily focus
                    as your workload grows.
                </p>

                {/* Symmetrical Monthly / Yearly Toggle (Centered) */}
                <div className="flex justify-center pt-2">
                    <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setIsYearly(false)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                                !isYearly
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900"
                            }`}>
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsYearly(true)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                                isYearly
                                    ? "bg-white text-stone-950 dark:bg-stone-900 dark:text-stone-50 shadow-sm"
                                    : "text-stone-500 hover:text-stone-900"
                            }`}>
                            Yearly
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PRICING CARDS --- */}
            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
                {/* 1. Free Plan Card */}
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
                            Perfect for beginners exploring digital
                            organization.
                        </p>
                        <div className="border-t border-stone-100 dark:border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Max 2 daily Focus sessions
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Complete Habit Tracker
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Standard Task Planner
                            </div>
                        </div>
                    </div>
                    <Button asChild className="w-full mt-6" variant="outline">
                        <a href="/login">Get Started</a>
                    </Button>
                </div>

                {/* 2. Pro Plan Card */}
                <div className="p-6 bg-stone-950 border-2 border-orange-500 text-stone-100 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
                    {/* Symmetrical Green popular badge */}
                    <span className="absolute top-4 right-4 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">
                        Most popular
                    </span>

                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-orange-400">
                            Pro
                        </span>
                        <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <span>${proPrice}</span>
                            <span className="text-sm font-normal text-stone-400">
                                /month
                            </span>
                            {/* Relocated Discount Badge (Displays contextually next to the yearly pricing) */}
                            {isYearly && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                    Save 20%
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed">
                            Advanced academic tools for dedicated students.
                        </p>
                        <div className="border-t border-stone-800 pt-4 space-y-3 text-xs">
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />
                                Unlimited daily Focus sessions
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />
                                Google Calendar Integration
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />
                                Unlimited exams, habits, and tasks
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-orange-500" />
                                Priority task tags
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleProUpgrade}
                        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                        Get Pro Now
                    </Button>
                </div>
            </div>
        </section>
    );
}
