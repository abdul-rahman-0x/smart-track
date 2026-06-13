import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
    return (
        <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center space-y-8">
            <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    Designed for Focus
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
                    Reclaim Your Study Life <br />
                    <span className="text-stone-600 dark:text-stone-400">
                        Without The Noise.
                    </span>
                </h1>
                <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                    Smarter personal planning software that helps you build
                    daily consistency and stay organized — automatically.
                </p>

                <div className="flex justify-center gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="min-w-40 bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200 border-none transition-colors">
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>
            </div>

            {/* --- THEME-AWARE PREVIEW CONTAINER --- */}
            <div className="pt-12">
                <div className="relative mx-auto max-w-5xl p-2 rounded-2xl bg-stone-200/50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-2xl">
                    {/* Light Mode Preview Image (Hidden when dark mode class is present on html/body) */}
                    <Image
                        src="/dashboard-light.png"
                        alt="Smart Track Dashboard Workspace Overview (Light Mode)"
                        width={1024}
                        height={640}
                        unoptimized
                        priority
                        className="block dark:hidden rounded-xl border border-stone-200 shadow-sm object-cover w-full h-auto"
                    />

                    {/* Dark Mode Preview Image (Displayed exclusively when dark mode class is present) */}
                    <Image
                        src="/dashboard-dark.png"
                        alt="Smart Track Dashboard Workspace Overview (Dark Mode)"
                        width={1024}
                        height={640}
                        unoptimized
                        priority
                        className="hidden dark:block rounded-xl border border-stone-800 shadow-sm object-cover w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
