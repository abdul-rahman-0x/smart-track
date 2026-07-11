"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroMarquee } from "../hero-marquee";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden px-4 pt-28 pb-8 sm:pt-32 lg:pt-24">
            {/* Background Soft Glow Ambient Light */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-stone-500/10 dark:bg-stone-100/5 rounded-full blur-[90px] -z-10" />

            {/* Vertically centered grid container */}
            <div className="grid flex-1 grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
                {/* Left Side */}
                <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
                    <div className="space-y-5">
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-[58px] tracking-tighter leading-[1.02] text-foreground">
                            Track everything
                            <span className="block font-sans font-light text-muted-foreground">
                                that matters.
                            </span>
                        </h1>

                        <p className="max-w-xl mx-auto lg:mx-0 text-[17px] leading-8 text-muted-foreground font-sans">
                            Your habits, goals, and progress—all in one place.
                            Designed to help you stay focused and consistent
                            every day.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3.5">
                            <Button
                                asChild
                                size="lg"
                                className="min-w-44 font-semibold shadow-md transition-all duration-300 hover:shadow-lg bg-primary text-primary-foreground hover:opacity-90">
                                <Link href="/dashboard">Get Started Free</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="min-w-44 font-medium border-border hover:bg-accent hover:text-accent-foreground">
                                <Link href="#features">Explore Features</Link>
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-[11px] font-mono text-muted-foreground/80">
                            <span className="flex items-center gap-1.5">
                                <svg
                                    className="w-3.5 h-3.5 text-emerald-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                                No credit card required
                            </span>

                            <span className="flex items-center gap-1.5">
                                <svg
                                    className="w-3.5 h-3.5 text-emerald-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                                Secure authentication
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="relative mx-auto mt-8 h-[400px] w-full max-w-md sm:h-[430px] sm:max-w-lg lg:col-span-6 lg:mt-0 lg:h-[450px]">
                    {/* Layer 1 (Base): Habit Grid / Monthly Checklist Card */}
                    <div
                        className="absolute w-[80%] left-2 top-8 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-xl shadow-xl transition-transform duration-500
                    ">
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
                                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider font-sans">
                                    Monthly Checklist
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-stone-800" />
                            </div>
                        </div>

                        {/* Calendar Habit Matrix Representation */}
                        <div className="grid grid-cols-7 gap-1.5 pt-4">
                            {Array.from({ length: 28 }).map((_, index) => {
                                const isCompleted = [
                                    1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 19,
                                    20, 22, 23,
                                ].includes(index);
                                return (
                                    <div
                                        key={index}
                                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-mono border transition-colors ${
                                            isCompleted
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                                                : "bg-muted/30 border-border text-muted-foreground"
                                        }`}>
                                        {isCompleted ? (
                                            <svg
                                                className="w-2.5 h-2.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Layer 2 (Middle Right): Focus Session Analytics Card */}
                    <div
                        className="absolute right-2 top-14 w-[45%] p-4 rounded-xl border border-border bg-card shadow-2xl transition-transform duration-500
                    ">
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider font-sans">
                                Focus Goal
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-foreground font-serif">
                            3.5 Hours
                        </span>
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                                Daily Target Met
                            </span>
                        </div>
                    </div>

                    {/* Layer 3 (Bottom Right): Streamlined Focus Trend Card */}
                    <div className="absolute -left-2 bottom-4 w-[48%] p-4 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-2xl transition-all duration-500 z-20">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider font-sans">
                                    Focus Trend
                                </span>
                                <h3 className="text-xl font-serif text-foreground font-semibold">
                                    18.4 hrs
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                +14%
                            </span>
                        </div>

                        {/* Minimalist Sparkline */}
                        <div className="h-10 w-full flex items-end">
                            <svg
                                className="w-full h-8 text-emerald-500"
                                viewBox="0 0 100 20"
                                fill="none"
                                stroke="currentColor"
                                preserveAspectRatio="none">
                                {/* Crisp, clean bezier path */}
                                <path
                                    d="M0 18 C15 14, 30 16, 45 8 C60 0, 75 4, 100 2"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />
                                {/* Active endpoint node */}
                                <circle
                                    cx="100"
                                    cy="2"
                                    r="2"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>

                        {/* Compact Days Indicator */}
                        <div className="flex justify-between mt-2 px-0.5 text-[9px] font-mono text-muted-foreground">
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>
                            <span>S</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infinite Integrations Marquee component */}
            <div className="mt-12 lg:mt-16">
                <HeroMarquee />
            </div>
        </section>
    );
}
