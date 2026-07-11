import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";

export default async function Header() {
    const session = await auth();

    return (
        <header className="fixed left-1/2 top-4 z-50 flex h-14 w-[calc(100%-1.5rem)] max-w-[700px] -translate-x-1/2 items-center justify-between rounded-full border border-border/50 bg-background/80 px-3 shadow-sm backdrop-blur-xl transition-all md:top-6 md:h-[60px] md:w-[calc(100%-2rem)]">
            {/* Logo */}
            <Link
                href="/"
                className="flex shrink-0 items-center gap-2 pl-2 transition-opacity hover:opacity-80">
                <Logo className="h-5 w-5 text-emerald-500" />

                <span className="font-sans text-base font-semibold tracking-tight text-foreground sm:text-[18px]">
                    Smart Track
                </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                <a
                    href="#about"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    About
                </a>

                <a
                    href="#features"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Features
                </a>

                <a
                    href="#pricing"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    Pricing
                </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                {/* CTA with rotating arrow */}
                <Link
                    href={session ? "/dashboard" : "/login"}
                    className="group flex h-10 shrink-0 items-center rounded-full border border-stone-900 bg-stone-950 py-1.5 pl-4 pr-1.5 transition-all duration-300 hover:scale-[1.02] hover:bg-stone-900 dark:border-stone-200 dark:bg-stone-50 dark:hover:bg-stone-100">
                    <span className="mr-2 text-xs font-semibold text-stone-50 dark:text-stone-900">
                        {session ? "Dashboard" : "Sign In"}
                    </span>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-900 transition-transform duration-300 group-hover:-rotate-45 dark:bg-stone-900 dark:text-stone-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </div>
                </Link>

                {/* Theme Toggle Container */}
                <div className="rounded-full p-1">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
