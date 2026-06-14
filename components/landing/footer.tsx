"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SectionBadge } from "@/components/section-badge";

const LinkedinIcon = () => (
    <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const GithubIcon = () => (
    <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="border-t border-stone-200/40 dark:border-stone-800/40 bg-white dark:bg-stone-900/50">
            {/* ==================== PART 1: CTA BANNER ==================== */}
            <div className="relative w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-20 text-center overflow-hidden border-b border-stone-200/60 dark:border-zinc-900">
                <div className="relative z-10 max-w-xl mx-auto space-y-6">
                    {/* Centered Section Badge */}
                    <div className="flex justify-center">
                        <SectionBadge>Get Started</SectionBadge>
                    </div>

                    <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-tight">
                        Ready to reclaim your focus?
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                        Join thousands of students and professionals building
                        daily consistency without the clutter.
                    </p>

                    <div className="flex justify-center pt-2">
                        <Button
                            asChild
                            size="lg"
                            className="min-w-40 bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200 border-none transition-colors">
                            <Link href="/login">Start for free</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ==================== PART 2: THE SITEMAP & SOCIALS ==================== */}
            <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
                <div className="grid gap-8 sm:grid-cols-3 text-xs text-stone-500">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Logo className="size-6 text-stone-900 dark:text-stone-200 shrink-0" />
                                <p className="font-serif font-medium text-xl tracking-tight text-stone-900 dark:text-stone-200">
                                    Smart Track
                                </p>
                            </div>
                            <p className="text-stone-400 dark:text-stone-500 leading-relaxed max-w-xs pt-2">
                                Secure, fast, and seamless planning made
                                effortless.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 pt-1">
                            <a
                                href="https://www.linkedin.com/in/abdulrahman-in/"
                                className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer">
                                <LinkedinIcon />
                            </a>
                            <a
                                href="https://github.com/abdul-rahman-0x"
                                className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer">
                                <GithubIcon />
                            </a>
                        </div>
                    </div>

                    {/* Sitemap Navigation Column */}
                    <div className="space-y-2 sm:col-start-3 sm:justify-self-end">
                        <p className="font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[10px]">
                            Sitemap
                        </p>
                        <Link
                            href="/login"
                            className="block text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
                            Sign In
                        </Link>
                        <Link
                            href="/dashboard"
                            className="block text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
                            Dashboard
                        </Link>
                        <Link
                            href="/planner"
                            className="block text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
                            Planner
                        </Link>
                        <Link
                            href="/billing"
                            className="block text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
                            Billing
                        </Link>
                    </div>
                </div>

                {/* --- COPYRIGHT PANEL --- */}
                <div className="text-[12px] text-stone-400 pt-8 text-center border-t border-stone-200/50 dark:border-stone-900/60">
                    © 2026 smart-track. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
