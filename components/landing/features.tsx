"use client";

import React from "react";
import {
    Clock,
    BookOpen,
    Calendar,
    ListTodo,
    Flame,
    Check,
    Play,
    RotateCcw,
} from "lucide-react";

export default function Features() {
    return (
        <section className="max-w-5xl mx-auto px-4 py-20 space-y-12">
            {/* --- SECTION HEADER --- */}
            <div className="space-y-3 text-center md:text-left">
                <h3 className="text-3xl tracking-tight text-stone-900 dark:text-white">
                    Everything you need to stay on track
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                    A beautifully aligned system designed to eliminate daily
                    cognitive friction, track long-term momentum, and organize
                    your schedules.
                </p>
            </div>

            {/* --- BENTO GRID OVERVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* --- CARD 1: CONSISTENCY ROADMAP (md:col-span-3) --- */}
                <div className="md:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 flex flex-col justify-between gap-6 hover:border-emerald-500/30 transition-all duration-300">
                    <div className="space-y-2">
                        <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                            Consistency Roadmap
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Monitor your daily goal completions, review past
                            progress, and manage your year using an annual
                            contribution heatmap.
                        </p>
                    </div>

                    {/* Mockup: Mini Roadmap Heatmap */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-stone-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-4">
                        <div className="flex items-center justify-between text-[9px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <span>June 2026 Consistency</span>
                            <div className="flex gap-1.5">
                                <span
                                    className="size-2 rounded-sm bg-stone-200 dark:bg-stone-900"
                                    title="Rest Day"
                                />
                                <span
                                    className="size-2 rounded-sm bg-orange-500/15 border border-orange-500/30"
                                    title="Pending"
                                />
                                <span
                                    className="size-2 rounded-sm bg-emerald-500/15 border border-emerald-500/30"
                                    title="Partial"
                                />
                                <span
                                    className="size-2 rounded-sm bg-emerald-500"
                                    title="All Completed"
                                />
                            </div>
                        </div>

                        {/* Calendar grid representation */}
                        <div className="grid grid-cols-7 gap-2 max-w-[210px] mx-auto">
                            {Array.from({ length: 14 }).map((_, idx) => {
                                const state =
                                    idx === 3
                                        ? "pending"
                                        : idx === 7 || idx === 11
                                          ? "partial"
                                          : idx === 8 || idx === 9
                                            ? "completed"
                                            : "rest";
                                return (
                                    <div
                                        key={idx}
                                        className={`h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                                            state === "completed"
                                                ? "bg-emerald-500 text-stone-50"
                                                : state === "partial"
                                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                                  : state === "pending"
                                                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/30"
                                                    : "bg-stone-200 dark:bg-stone-900 text-stone-400 dark:text-stone-600 border border-stone-300 dark:border-stone-800"
                                        }`}>
                                        {idx + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- CARD 2: FOCUS STATE TIMER (md:col-span-2) --- */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 flex flex-col justify-between gap-6 hover:border-orange-500/30 transition-all duration-300">
                    <div className="space-y-2">
                        <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                            Focus State Timer
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Quiet your mind, block out the digital noise, and
                            execute deep work sessions with customizable
                            Pomodoro targets.
                        </p>
                    </div>

                    {/* Mockup: Circular Focus Timer */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-stone-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner flex flex-col items-center gap-3">
                        <div className="flex gap-2 p-1 rounded-lg bg-white dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-900/60">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-stone-900 text-stone-50 dark:bg-stone-50 dark:text-stone-900">
                                Focus (25m)
                            </span>
                            <span className="text-[9px] font-bold text-stone-400 dark:text-stone-500 px-2 py-0.5">
                                Break (5m)
                            </span>
                        </div>

                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg
                                className="w-full h-full transform -rotate-90"
                                viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    className="stroke-stone-200 dark:stroke-stone-900"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    className="stroke-orange-500"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={263}
                                    strokeDashoffset={40}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-sm font-black text-stone-900 dark:text-stone-50">
                                25:00
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-stone-900 text-stone-50 dark:bg-stone-50 dark:text-stone-900 text-[10px] font-bold">
                                <Play className="size-2.5 fill-current" /> Start
                            </button>
                            <button className="p-1 rounded-md border border-stone-300 dark:border-stone-700 text-stone-400">
                                <RotateCcw className="size-2.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CARD 3: ROUTINES & HABITS (md:col-span-2) --- */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 flex flex-col justify-between gap-6 hover:border-orange-500/30 transition-all duration-300">
                    <div className="space-y-2">
                        <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <ListTodo className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                            Routines &amp; Habits
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Log routine actions dynamically. Toggle completions
                            across your weekly grid, tracking daily streaks and
                            building momentum.
                        </p>
                    </div>

                    {/* Mockup: Habit grid rows from screenshot */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-stone-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                                Weekly Habits
                            </span>
                            <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                                <Flame className="size-3 fill-current" /> 14d
                                streak
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                <span className="truncate pr-2">
                                    Study 2 Hours
                                </span>
                                <div className="flex gap-1">
                                    <div className="size-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                                        <Check className="size-2.5 stroke-3" />
                                    </div>
                                    <div className="size-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                                        <Check className="size-2.5 stroke-3" />
                                    </div>
                                    <div className="size-4 rounded border border-stone-300 dark:border-stone-700" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                <span className="truncate pr-2">
                                    Read 20 pages
                                </span>
                                <div className="flex gap-1">
                                    <div className="size-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                                        <Check className="size-2.5 stroke-3" />
                                    </div>
                                    <div className="size-4 rounded border border-stone-300 dark:border-stone-700" />
                                    <div className="size-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center">
                                        <Check className="size-2.5 stroke-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CARD 4: EXAMS & SYLLABUS COVERAGE (md:col-span-3) --- */}
                <div className="md:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 flex flex-col justify-between gap-6 hover:border-emerald-500/30 transition-all duration-300">
                    <div className="space-y-2">
                        <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-lg text-stone-900 dark:text-stone-100">
                            Milestones &amp; Syllabus
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Monitor exam countdown timelines, outline key study
                            guidelines, and map topics to measure precise
                            preparation rates.
                        </p>
                    </div>

                    {/* Mockup: Academic exams widget */}
                    <div className="p-4 rounded-xl bg-stone-50/50 dark:bg-stone-950/80 border border-stone-200/60 dark:border-stone-900/60 shadow-inner space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-200/50 dark:border-stone-900/50 pb-2">
                            <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">
                                Neural Networks &amp; Deep Learning
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                5d left
                            </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center text-stone-400">
                                <span className="block text-[8px] font-bold uppercase tracking-wider text-stone-400">
                                    Syllabus Progress
                                </span>
                                <span className="text-[9px] font-bold text-emerald-500">
                                    3/4 Topics
                                </span>
                            </div>

                            <div className="flex gap-1.5 justify-center">
                                {Array.from({ length: 12 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 flex-1 rounded-[1px] transition-all duration-500 ${
                                            idx < 9
                                                ? "bg-emerald-500"
                                                : "bg-stone-200 dark:bg-stone-900"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
