import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const footerLinks = {
    resources: [
        { name: "Sign in", href: "/login" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Planner", href: "/planner" },
        { name: "Billing", href: "/billing" },
    ],
    legal: [
        { name: "Terms of service", href: "/terms" },
        { name: "Privacy policy", href: "/privacy" },
    ],
};

export default function Footer() {
    return (
        <footer className="w-full pt-20">
            <div className="mx-auto max-w-5xl px-4">
                <div className="flex flex-col items-center border-b border-stone-200/60 dark:border-stone-900/60 pb-20 text-center space-y-6">
                    <Logo className="h-10 w-auto" />

                    <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-[1.1] text-stone-900 dark:text-white max-w-xl mx-auto">
                        Ready to reclaim your focus?
                    </h3>

                    <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                        Join thousands of students and professionals building
                        daily consistency without the clutter.
                    </p>

                    <div className="pt-4">
                        <Button asChild size="lg" className="px-4">
                            <Link href="/login">Start for free</Link>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start py-20 gap-12">
                    <div className="max-w-[280px] space-y-4">
                        <Logo className="h-7 w-auto" />
                        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                            Secure, fast, and seamless planning made effortless.
                            Build your daily streaks and focus on what actually
                            matters.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-16 md:gap-32">
                        <div className="space-y-5">
                            <h4 className="font-sans text-sm text-stone-900 dark:text-stone-50">
                                Resources
                            </h4>
                            <ul className="space-y-2">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-stone-500 dark:text-stone-400 transition-colors duration-300 hover:text-orange-500 cursor-pointer">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-5">
                            <h4 className="font-sans text-sm text-stone-900 dark:text-stone-50">
                                Legal
                            </h4>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-stone-500 dark:text-stone-400 transition-colors duration-300 hover:text-orange-500 cursor-pointer">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-6 border-t border-stone-200/60 dark:border-stone-900/60 py-14 md:flex-row">
                    <p className="text-xs text-stone-400">
                        © 2026 Smart Track. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
