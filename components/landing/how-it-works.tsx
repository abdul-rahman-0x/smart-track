"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComparisonRow {
    feature: string;
    before: string;
    after: string;
}

const comparisonData: ComparisonRow[] = [
    {
        feature: "Habit Consistency",
        before: "Scattered mobile apps, forgotten streaks, zero historical data",
        after: "Automated streak calculation with 4-week visual consistency matrices",
    },
    {
        feature: "Focus & Execution",
        before: "Unchecked tab switching and chaotic digital distractions",
        after: "Quiet 90-minute deep work intervals with realtime velocity curves",
    },
    {
        feature: "Exam Milestones",
        before: "Manual reminders, messy notes, and last-minute exam cramming",
        after: "Dynamic countdown timelines with automated syllabus completion rates",
    },
    {
        feature: "Subscription Costs",
        before: "Unmonitored zombie subscriptions quietly draining funds",
        after: "Centralized monthly burn audits powered by verified Stripe billing",
    },
    {
        feature: "Speed & Responsiveness",
        before: "Laggy, bloated productivity tools that feel like work themselves",
        after: "Optimistic UI mutations powered by Next.js and Neon Postgres",
    },
];

export default function HowItWorks() {
    return (
        <section id="about" className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8">
            {/* 1. Casca Specs & Metrics Split */}
            <div className="grid grid-cols-1 gap-12 border-b border-white/[0.06] pb-20 lg:grid-cols-12 lg:gap-16">
                {/* Left Column: Heading, Value Proposition, CTA */}
                <div className="space-y-6 lg:col-span-5">
                    <h2 className="font-serif text-3xl font-light leading-[1.08] tracking-normal text-[#f9f8f6] sm:text-4xl lg:text-[46px]">
                        Builders accelerate daily momentum with Smart Track
                    </h2>
                    <p className="max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                        Eliminate cognitive friction, streamline your study priorities, and build compounding daily routines that stick.
                    </p>
                    <div className="pt-2">
                        <Button asChild variant="secondary">
                            <Link href="/dashboard">Get started</Link>
                        </Button>
                    </div>
                </div>

                {/* Right Column: 2x2 Big Stat Metrics Grid */}
                <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7">
                    {/* Stat 1 */}
                    <div className="space-y-2">
                        <div className="font-serif text-5xl font-light tracking-normal text-[#f9f8f6] sm:text-6xl">
                            3.5x
                        </div>
                        <p className="font-sans text-[14px] leading-relaxed text-[#f9f8f6]/60">
                            higher focus completion through distraction-free intervals.
                        </p>
                    </div>

                    {/* Stat 2 */}
                    <div className="space-y-2">
                        <div className="font-serif text-5xl font-light tracking-normal text-[#f9f8f6] sm:text-6xl">
                            85%
                        </div>
                        <p className="font-sans text-[14px] leading-relaxed text-[#f9f8f6]/60">
                            reduction in planning fatigue and fragmented note-taking.
                        </p>
                    </div>

                    {/* Hairline Divider */}
                    <div className="col-span-1 hidden border-t border-white/[0.06] sm:col-span-2 sm:block" />

                    {/* Stat 3 */}
                    <div className="space-y-2">
                        <div className="font-serif text-5xl font-light tracking-normal text-[#f9f8f6] sm:text-6xl">
                            14 <span className="font-sans text-3xl text-[#f9f8f6]/40">days</span>
                        </div>
                        <p className="font-sans text-[14px] leading-relaxed text-[#f9f8f6]/60">
                            average streak to lock in an unbreakable daily routine.
                        </p>
                    </div>

                    {/* Stat 4 */}
                    <div className="space-y-2">
                        <div className="font-serif text-5xl font-light tracking-normal text-[#f9f8f6] sm:text-6xl">
                            100%
                        </div>
                        <p className="font-sans text-[14px] leading-relaxed text-[#f9f8f6]/60">
                            visibility over recurring subscription costs and milestones.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Casca Product Comparison Table */}
            <div className="pt-20 sm:pt-28">
                <div className="mb-10 flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end">
                    <div>
                        <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/40">
                            The Architecture
                        </span>
                        <h3 className="mt-1 font-serif text-2xl font-light text-[#f9f8f6] sm:text-3xl">
                            Workflow comparison
                        </h3>
                    </div>
                    <p className="max-w-xs font-sans text-[16px] text-[#f9f8f6]/50">
                        Why disciplined creators switch from scattered to-do apps to a unified canvas.
                    </p>
                </div>

                {/* Table Header */}
                <div className="hidden grid-cols-12 gap-4 border-b border-white/[0.06] pb-4 font-sans text-[12px] font-normal uppercase tracking-wider text-[#f9f8f6]/40 md:grid">
                    <div className="col-span-3">Capability</div>
                    <div className="col-span-4 pl-2">Without Smart Track</div>
                    <div className="col-span-5 pl-2 text-[#f9f8f6]">With Smart Track</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/[0.04]">
                    {comparisonData.map((row, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-1 items-start gap-4 py-5 transition-colors md:grid-cols-12 md:items-center ${index % 2 === 1 ? "bg-white/[0.015]" : "bg-transparent"
                                } px-2 sm:px-3 rounded-[6px]`}
                        >
                            {/* Feature Title */}
                            <div className="font-sans text-[16px] font-medium text-[#f9f8f6] md:col-span-3">
                                {row.feature}
                            </div>

                            {/* Without Smart Track (Muted Grey Dash) */}
                            <div className="flex items-start gap-2.5 text-[16px] text-[#f9f8f6]/50 md:col-span-4 md:pl-2">
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#d1d1d1]/50"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span>{row.before}</span>
                            </div>

                            {/* With Smart Track (Casca Green Shield Check) */}
                            <div className="flex items-start gap-2.5 text-[16px] text-[#f9f8f6] md:col-span-5 md:pl-2">
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#66cc63]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                                        fill="#66cc63"
                                        fillOpacity="0.15"
                                        stroke="#66cc63"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M9 12l2 2 4-4"
                                        stroke="#66cc63"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="font-medium">{row.after}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
