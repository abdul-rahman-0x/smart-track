import React from "react";
import { Sparkles, ListTodo, GraduationCap } from "lucide-react";

export default function Features() {
    return (
        <section className="max-w-5xl mx-auto px-4 py-16 space-y-8">
            <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold tracking-tight">
                    Everything you need to stay on track
                </h3>
                <p className="text-sm text-stone-400">
                    Three focused tools that work together — no clutter, no
                    distractions.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Habit Card */}
                <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3">
                    <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        <ListTodo className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg">Habit Streaks</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Build daily consistency and track your momentum using
                        localized 7-day completion ribbons.
                    </p>
                </div>

                {/* Task Card */}
                <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3">
                    <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg">Task Planner</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Organize assignments, prioritize schedules, and complete
                        hourly blocks inside a calm interface.
                    </p>
                </div>

                {/* Exams Card */}
                <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3">
                    <div className="p-2 w-fit rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-lg">Exam Milestones</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Monitor target dates, map your syllabus chapters, and
                        track countdowns to prevent cramming.
                    </p>
                </div>
            </div>
        </section>
    );
}
