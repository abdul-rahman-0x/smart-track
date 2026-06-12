import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="border-t border-stone-200/40 dark:border-stone-800/40 bg-white dark:bg-stone-900/50">
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
                {/* Bottom CTA block in the footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-12 border-b border-stone-100 dark:border-stone-800">
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold">
                            Ready to take control of your time?
                        </h4>
                        <p className="text-xs text-stone-400">
                            Join thousands of students building consistency
                            without the clutter.
                        </p>
                    </div>
                    <Button
                        asChild
                        size="lg"
                        className="self-start sm:self-auto">
                        <Link href="/login">Get Started Now</Link>
                    </Button>
                </div>

                {/* Navigation links & Socials */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-stone-500">
                    <div className="space-y-2">
                        <p className="font-bold text-stone-800 dark:text-stone-200">
                            smart-track
                        </p>
                        <p className="text-stone-400 max-w-xs">
                            Secure, fast, and seamless planning made effortless.
                        </p>
                    </div>

                    <div className="flex gap-8">
                        <div className="space-y-2">
                            <p className="font-bold text-stone-800 dark:text-stone-200">
                                Navigation
                            </p>
                            <Link
                                href="/login"
                                className="block hover:underline">
                                Sign In
                            </Link>
                            <Link
                                href="/dashboard"
                                className="block hover:underline">
                                Dashboard
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-stone-800 dark:text-stone-200">
                                Socials
                            </p>
                            <a
                                href="https://github.com/YOUR_GITHUB_USERNAME"
                                className="block hover:underline"
                                target="_blank"
                                rel="noopener noreferrer">
                                GitHub
                            </a>
                            <a
                                href="https://x.com"
                                className="block hover:underline"
                                target="_blank"
                                rel="noopener noreferrer">
                                Twitter (X)
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-[10px] text-stone-400 pt-6 text-center border-t border-stone-100 dark:border-stone-800">
                    © {new Date().getFullYear()} smart-track. All rights
                    reserved. Built with passion and focus.
                </div>
            </div>
        </footer>
    );
}
