"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
                if ((error as Error)?.message?.includes("NEXT_REDIRECT")) {
                    return;
                }
                console.error("Payment initiation failed:", error);
            }
        });
    };

    return (
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8">
            {/* 1. Header */}
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl font-light leading-[1.08] tracking-normal text-[#f9f8f6] sm:text-5xl lg:text-[54px]">
                    Transparent plans for <br className="hidden sm:inline" />
                    disciplined builders
                </h2>
                <p className="mx-auto mt-5 max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                    Start for free to establish your daily streak. Upgrade whenever you need unlimited project pacing and automated audits.
                </p>

                {/* Minimalist Casca Billing Toggle */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center rounded-[7.4px] border border-white/[0.08] bg-[#161616] p-1">
                        <button
                            type="button"
                            onClick={() => setIsYearly(false)}
                            className={`rounded-[5px] px-3.5 py-1.5 font-sans text-[12.5px] transition-colors duration-200 ${!isYearly
                                ? "bg-[#20201f] font-medium text-[#f9f8f6]"
                                : "text-[#f9f8f6]/50 hover:text-[#f9f8f6]"
                                }`}
                        >
                            Monthly billing
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsYearly(true)}
                            className={`flex items-center gap-1.5 rounded-[5px] px-3.5 py-1.5 font-sans text-[12.5px] transition-colors duration-200 ${isYearly
                                ? "bg-[#20201f] font-medium text-[#f9f8f6]"
                                : "text-[#f9f8f6]/50 hover:text-[#f9f8f6]"
                                }`}
                        >
                            <span>Annual billing</span>
                            <span className="rounded bg-[#66cc63]/15 px-1.5 py-0.2 font-mono text-[10px] text-[#66cc63]">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Pricing Cards Grid */}
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                {/* FREE TIER CARD */}
                <div className="flex flex-col justify-between rounded-[16px] border border-white/[0.06] bg-[#161616] p-7  sm:p-9">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/40">
                                Starter Tier
                            </span>
                        </div>

                        <div>
                            <div className="flex items-baseline">
                                <span className="font-serif text-5xl font-light text-[#f9f8f6] sm:text-6xl">
                                    $0
                                </span>
                                <span className="ml-2 font-sans text-[14px] text-[#f9f8f6]/40">
                                    / month
                                </span>
                            </div>
                            <p className="mt-3 font-sans text-[16px] leading-relaxed text-[#f9f8f6]/60">
                                Essential baseline routine tracking for individual students and creators.
                            </p>
                        </div>

                        {/* Feature Checklist */}
                        <div className="space-y-3.5 border-t border-white/[0.06] pt-6">
                            {[
                                "Up to 3 active habit streak routines",
                                "1 academic milestone countdown",
                                "10 daily planner execution tasks",
                                "Standard 25/5 Pomodoro focus timer",
                                "Historical 14-day consistency view",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-[16px] text-[#f9f8f6]/70">
                                    <svg
                                        className="h-4 w-4 shrink-0 text-[#66cc63]"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-4">
                        <Button asChild variant="outline" className="w-full justify-center">
                            <Link href="/login">Get started free</Link>
                        </Button>
                    </div>
                </div>

                {/* PRO TIER CARD (Elevated Casca Container) */}
                <div className="relative flex flex-col justify-between rounded-[16px] border border-white/[0.14] bg-[#20201f] p-7 shadow-[0_16px_40px_rgba(0,0,0,0.32)] sm:p-9">
                    {/* Subtle Pro Pill */}
                    <div className="absolute right-7 top-7">
                        <span className="rounded-[4px] bg-[#66cc63]/15 px-2 py-0.5 font-sans text-[11px] font-normal text-[#66cc63]">
                            Full Workspace
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#66cc63]">
                                Pro Performance
                            </span>
                        </div>

                        <div>
                            <div className="flex items-baseline">
                                <span className="font-serif text-5xl font-light text-[#f9f8f6] sm:text-6xl">
                                    ${proPrice.toFixed(0)}
                                </span>
                                <span className="ml-2 font-sans text-[14px] text-[#f9f8f6]/40">
                                    / month
                                </span>
                                {isYearly && (
                                    <span className="ml-2.5 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#f9f8f6]/70">
                                        Billed annually
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 font-sans text-[16px] leading-relaxed text-[#f9f8f6]/60">
                                Unlimited habit velocity, exam pacing coaching, and recurring subscription tracking.
                            </p>
                        </div>

                        {/* Feature Checklist */}
                        <div className="space-y-3.5 border-t border-white/[0.06] pt-6">
                            {[
                                "Unlimited habit streak engines & streak freeze",
                                "Automated Syllabus Pacing Coach",
                                "Unlimited daily tasks with Priority Queue",
                                "Comprehensive 365-day consistency heatmap",
                                "Subscription burn auditor powered by Stripe",
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-[16px] text-[#f9f8f6]">
                                    <svg
                                        className="h-4 w-4 shrink-0 text-[#66cc63]"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-4">
                        <Button
                            disabled={isPending}
                            onClick={handleProUpgrade}
                            variant="secondary"
                            className="w-full justify-center"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0e0d0c] border-t-transparent" />
                                    <span>Connecting to Stripe...</span>
                                </div>
                            ) : (
                                "Upgrade to Pro"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
