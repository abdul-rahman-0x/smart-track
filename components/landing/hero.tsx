import React from "react";
import Link from "next/id";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center space-y-8">
            <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    Academic Productivity Redefined
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
                    Master your habits. <br />
                    <span className="text-stone-600 dark:text-stone-400">
                        Conquer your deadlines.
                    </span>
                </h1>
                <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                    A unified, high-focus workspace for habits, tasks, and exam
                    prep — designed to keep students focused without the noise.
                </p>
                <div className="flex justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="min-w-40 bg-stone-900 text-stone-50 dark:bg-stone-50 dark:text-stone-900">
                        <a href="/dashboard">Get Started</a>
                    </Button>
                </div>
            </div>

            {/* Glass-blurred Bento Dashboard Mockup Preview */}
            <div className="pt-12">
                <div className="relative mx-auto max-w-4xl p-2 rounded-2xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 backdrop-blur-md">
                    <div className="h-64 sm:h-96 rounded-xl bg-stone-100 dark:bg-stone-950 flex items-center justify-center border border-stone-200 dark:border-stone-800">
                        <span className="text-xs font-mono text-stone-400">
                            High-fidelity Interactive Dashboard Preview
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
