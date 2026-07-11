"use client";

import React from "react";
import { Clock, Check, Flame, Sparkles, Target } from "lucide-react";

export default function HowItWorks() {
    return (
        <section id="about" className="max-w-5xl mx-auto px-4 py-20 space-y-16">
            {/* --- SECTION HEADER --- */}
            <div className="text-center space-y-4">
                <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-[1.1] text-stone-900 dark:text-white max-w-xl mx-auto">
                    Build a reliable system for continuous progress
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                    Turn scattered tasks into structured daily focus blocks to
                    build unstoppable routine momentum.
                </p>
            </div>

            {/* --- THREE STEPS GRID --- */}
            <div className="grid gap-6 md:grid-cols-3 relative">
                {/* Step 1: Structure your focus (Emerald themed) */}
                <div className="p-6 bg-white dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-8 hover:border-emerald-500/30 transition-all duration-300">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                            1. Structure your focus
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Sync external calendar channels, outline custom
                            parameters, and establish your daily milestone
                            goals.
                        </p>
                    </div>

                    {/* MOCKUP: Goal Configuration Panel */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-zinc-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-3">
                        <div className="flex justify-between items-center text-[9px] text-stone-400 border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-500">
                                <Target className="size-3 text-emerald-500" />{" "}
                                Goal Setup
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-2 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                            <div className="flex items-center justify-between">
                                <span>Target Date set to June 18</span>
                                <Check className="size-3.5 text-emerald-500 stroke-3" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Syllabus Chapters Mapped</span>
                                <Check className="size-3.5 text-emerald-500 stroke-3" />
                            </div>
                            <div className="flex items-center justify-between opacity-60">
                                <span>Add sub-checklist blocks</span>
                                <div className="size-3 rounded-full border border-stone-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Priority Queue (Blue themed) */}
                <div className="p-6 bg-white dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-8 hover:border-blue-500/30 transition-all duration-300">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                            2. Automate priority lists
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Let the dynamic engine construct your primary
                            checklists automatically, keeping you focused on
                            execution.
                        </p>
                    </div>

                    {/* MOCKUP: Dynamic Priority Queue */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-zinc-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <Sparkles className="size-3 text-blue-500" />
                            <span>Priority Queue</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                            <div className="flex justify-between items-center bg-white dark:bg-stone-900/40 p-2 rounded border border-stone-200/60 dark:border-stone-900/60">
                                <span className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-blue-500" />{" "}
                                    Deep Learning Proof
                                </span>
                                <span className="text-[8px] font-extrabold text-blue-500 uppercase">
                                    90m
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white dark:bg-stone-900/40 p-2 rounded border border-stone-200/60 dark:border-stone-900/60">
                                <span className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-indigo-500" />{" "}
                                    Attention Layer Test
                                </span>
                                <span className="text-[8px] font-extrabold text-indigo-500 uppercase">
                                    45m
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step 3: Track and multiply (Amber themed) */}
                <div className="p-6 bg-white dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-8 hover:border-amber-500/30 transition-all duration-300">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-50">
                            3. Track and multiply
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Watch daily streaks compile automatically,
                            maintaining complete control over your productivity
                            lifecycle.
                        </p>
                    </div>

                    {/* MOCKUP: Unstoppable Consistency Chain */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-zinc-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-3">
                        <div className="flex justify-between items-center text-[9px] text-stone-400 border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <span>Consistency Victory Ribbon</span>
                            <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                                <Flame className="size-3 fill-current" /> 14d
                            </span>
                        </div>

                        {/* Connected consecutive daily checkbox metrics */}
                        <div className="flex gap-1.5 justify-center">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.15)] shrink-0">
                                    <Check className="size-3.5 stroke-3" />
                                </div>
                            ))}
                            {/* Remaining target day in the chain */}
                            <div className="h-6 w-6 rounded border border-stone-300 dark:border-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-600 shrink-0">
                                <Clock className="size-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
