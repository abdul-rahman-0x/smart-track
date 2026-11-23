"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Features() {
    const [activeTab, setActiveTab] = useState<"focus" | "break">("focus");

    return (
        <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8">
            {/* 1. Casca Horizontal Split Header */}
            <div className="grid grid-cols-1 gap-8 border-b border-white/[0.06] pb-16 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-7">
                    <h2 className="font-serif text-3xl font-light leading-[1.08] tracking-normal text-[#f9f8f6] sm:text-5xl lg:text-[54px]">
                        Daily routines and execution <br className="hidden sm:inline" />
                        can be effortless.
                    </h2>
                </div>
                <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:pl-8">
                    <p className="font-sans text-[15.5px] font-normal leading-[1.6] tracking-[-0.01em] text-[#f9f8f6]/60">
                        Smart Track eliminates fragmented productivity tools, unifying your habits, study schedules, and project timelines in one calm workspace.
                    </p>
                    <Button asChild variant="white">
                        <Link href="/dashboard">Explore workspace</Link>
                    </Button>
                </div>
            </div>

            {/* 2. Alternating Zig-Zag Feature Rows */}
            <div className="space-y-24 pt-20 sm:space-y-32 sm:pt-28">
                {/* ROW 1: Habit Engine [Visual Left | Copy Right] */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* UI Canvas */}
                    <div className="overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161616] p-6  sm:p-8 lg:col-span-6">
                        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#66cc63]" />
                                <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/50">
                                    Consistency Matrix
                                </span>
                            </div>
                            <span className="font-mono text-[10.5px] text-[#66cc63]">
                                14-Day Streak
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { title: "Deep Work (90m block)", tag: "Engineering", done: true },
                                { title: "Algorithms Practice", tag: "Interview", done: true },
                                { title: "Distributed Systems Reading", tag: "Academic", done: false },
                            ].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-[8px] border border-white/[0.04] bg-[#20201f] p-3 text-[16px]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`flex h-4 w-4 items-center justify-center rounded-[4px] text-[10px] ${h.done
                                                ? "bg-[#66cc63] font-bold text-[#0e0d0c]"
                                                : "border border-white/20"
                                                }`}
                                        >
                                            {h.done && "✓"}
                                        </span>
                                        <span
                                            className={
                                                h.done
                                                    ? "font-sans text-[#f9f8f6]/50 line-through"
                                                    : "font-sans text-[#f9f8f6]"
                                            }
                                        >
                                            {h.title}
                                        </span>
                                    </div>
                                    <span className="rounded bg-[#161616] px-2 py-0.5 text-[10.5px] text-[#f9f8f6]/40">
                                        {h.tag}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Matrix Dots */}
                        <div className="mt-5 grid grid-cols-7 gap-1.5 border-t border-white/[0.06] pt-4">
                            {Array.from({ length: 14 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`flex h-6 items-center justify-center rounded-[4px] font-mono text-[9.5px] ${idx < 11
                                        ? "border border-[#66cc63]/30 bg-[#66cc63]/15 text-[#66cc63]"
                                        : "border border-white/5 bg-[#20201f]/50 text-[#f9f8f6]/30"
                                        }`}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="space-y-4 lg:col-span-6 lg:pl-6">
                        <h3 className="font-serif text-2xl font-light  text-[#f9f8f6] sm:text-[38px] sm:text-[44px] lg:text-[48px]">
                            Automate consistency with daily streak engines
                        </h3>
                        <p className="max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                            Log daily habits with automated streak calculations and historical consistency views. Build long-term routines that compound over months, not days.
                        </p>
                    </div>
                </div>

                {/* ROW 2: Focus Session Timer [Copy Left | Visual Right] */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Copy (Left on desktop) */}
                    <div className="order-2 space-y-4 lg:order-1 lg:col-span-6 lg:pr-6">
                        <h3 className="font-serif text-2xl font-light leading-[1.15] text-[#f9f8f6] sm:text-[38px] sm:text-[44px] lg:text-[48px]">
                            Deep focus intervals without digital noise
                        </h3>
                        <p className="max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                            Execute 90-minute deep work intervals with minimal Pomodoro timers. Track focus velocity and measure productive hours without background clutter.
                        </p>
                    </div>

                    {/* UI Canvas (Right on desktop) */}
                    <div className="order-1 overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161616] p-6  sm:p-8 lg:order-2 lg:col-span-6">
                        <div className="flex flex-col items-center gap-5">
                            {/* Segmented Mode Selector */}
                            <div className="flex rounded-[6px] border border-white/[0.06] bg-[#20201f] p-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("focus")}
                                    className={`rounded-[4px] px-3 py-1 font-sans text-[11px] transition-colors ${activeTab === "focus"
                                        ? "bg-[#f9f8f6] font-medium text-[#0e0d0c]"
                                        : "text-[#f9f8f6]/50 hover:text-[#f9f8f6]"
                                        }`}
                                >
                                    Deep Work (25m)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("break")}
                                    className={`rounded-[4px] px-3 py-1 font-sans text-[11px] transition-colors ${activeTab === "break"
                                        ? "bg-[#f9f8f6] font-medium text-[#0e0d0c]"
                                        : "text-[#f9f8f6]/50 hover:text-[#f9f8f6]"
                                        }`}
                                >
                                    Rest Interval (5m)
                                </button>
                            </div>

                            {/* Minimalist Circular Timer */}
                            <div className="relative flex h-28 w-28 items-center justify-center">
                                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        className="stroke-[#20201f]"
                                        strokeWidth="5"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        className="stroke-[#66cc63]"
                                        strokeWidth="5"
                                        fill="transparent"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={60}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute font-serif text-2xl font-light text-[#f9f8f6]">
                                    {activeTab === "focus" ? "25:00" : "05:00"}
                                </span>
                            </div>

                            {/* Action State */}
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#66cc63]" />
                                <span className="font-sans text-[12px] text-[#f9f8f6]/60">
                                    Daily focus goal: 3.5 hrs met
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 3: Milestones & Syllabus [Visual Left | Copy Right] */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* UI Canvas */}
                    <div className="overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161616] p-6  sm:p-8 lg:col-span-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                                <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/50">
                                    Academic &amp; Project Timelines
                                </span>
                                <span className="font-mono text-[10.5px] text-[#f9f8f6]/60">2 Active</span>
                            </div>

                            <div className="rounded-[8px] border border-white/[0.04] bg-[#20201f] p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-[16px] font-medium text-[#f9f8f6]">
                                        Distributed Systems Final
                                    </span>
                                    <span className="rounded bg-[#66cc63]/10 px-2 py-0.5 font-mono text-[10px] text-[#66cc63]">
                                        In 3 days
                                    </span>
                                </div>
                                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#f9f8f6]/50">
                                    <span>Syllabus Coverage</span>
                                    <span>75% Prepared</span>
                                </div>
                                <div className="mt-1.5 flex gap-1">
                                    {Array.from({ length: 8 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 flex-1 rounded-[1px] ${idx < 6 ? "bg-[#66cc63]" : "bg-white/10"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[8px] border border-white/[0.04] bg-[#20201f] p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-[16px] font-medium text-[#f9f8f6]">
                                        Stripe Billing v2 Launch
                                    </span>
                                    <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#f9f8f6]/60">
                                        In 6 days
                                    </span>
                                </div>
                                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#f9f8f6]/50">
                                    <span>Milestone Quota</span>
                                    <span>4/5 Tasks Done</span>
                                </div>
                                <div className="mt-1.5 flex gap-1">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 flex-1 rounded-[1px] ${idx < 4 ? "bg-[#66cc63]" : "bg-white/10"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="space-y-4 lg:col-span-6 lg:pl-6">
                        <h3 className="font-serif text-2xl font-light leading-[1.15] text-[#f9f8f6] sm:text-[38px] sm:text-[44px] lg:text-[48px]">
                            Coordinate exams and coding milestones without friction
                        </h3>
                        <p className="max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                            Plan assignments, study blocks, and engineering deadlines in a unified schedule view. Keep deadlines visual with countdown badges and automated syllabus tracking.
                        </p>
                    </div>
                </div>

                {/* ROW 4: Subscription Management [Copy Left | Visual Right] */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Copy (Left on desktop) */}
                    <div className="order-2 space-y-4 lg:order-1 lg:col-span-6 lg:pr-6">
                        <h3 className="font-serif text-2xl font-light leading-[1.15] text-[#f9f8f6] sm:text-[38px] sm:text-[44px] lg:text-[48px]">
                            Audit personal subscriptions and monthly burn
                        </h3>
                        <p className="max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                            Track personal recurring software costs alongside platform tier upgrades powered by Stripe. Never let unused developer tools or subscriptions quietly drain your funds.
                        </p>
                    </div>

                    {/* UI Canvas (Right on desktop) */}
                    <div className="order-1 overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161616] p-6  sm:p-8 lg:order-2 lg:col-span-6">
                        <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                            <div>
                                <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/50">
                                    Recurring Expenses
                                </span>
                                <p className="mt-0.5 font-serif text-2xl font-light text-[#f9f8f6]">
                                    $48.00 <span className="font-sans text-xs text-[#f9f8f6]/50">/month</span>
                                </p>
                            </div>
                            <span className="rounded-[4px] border border-white/10 bg-[#20201f] px-2 py-0.5 font-mono text-[10.5px] text-[#66cc63]">
                                Stripe Verified
                            </span>
                        </div>

                        <div className="space-y-2">
                            {[
                                { name: "GitHub Copilot", cycle: "Monthly", cost: "$10.00" },
                                { name: "Vercel Pro", cycle: "Monthly", cost: "$20.00" },
                                { name: "Neon Serverless Postgres", cycle: "Monthly", cost: "$18.00" },
                            ].map((sub, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between rounded-[8px] border border-white/[0.04] bg-[#20201f] px-3.5 py-2.5"
                                >
                                    <div>
                                        <p className="font-sans text-[12.5px] font-medium text-[#f9f8f6]">
                                            {sub.name}
                                        </p>
                                        <span className="font-mono text-[10.5px] text-[#f9f8f6]/40">
                                            {sub.cycle}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[12px] font-medium text-[#f9f8f6]">
                                        {sub.cost}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
