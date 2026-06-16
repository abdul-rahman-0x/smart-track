import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionBadge } from "@/components/section-badge";

// This is a Base64 encoded tiny 10px image of a neutral stone color. 
const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/vnbfwAJYgPN9C99FwAAAABJRU5ErkJggg==";

export default function Hero() {
    return (
        <section className="relative max-w-5xl mx-auto px-4 pt-24 pb-12 text-center space-y-8">
            <div className="space-y-6">
                <SectionBadge>Designed for Focus</SectionBadge>

                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[-0.04em] leading-[1.1] max-w-3xl mx-auto text-stone-900 dark:text-white">
                    Reclaim Your Study Life <br />
                    <span className="text-stone-500 dark:text-stone-400">
                        Without The Noise.
                    </span>
                </h1>

                <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-sans">
                    Smarter personal planning software that helps you build
                    daily consistency and stay organized — automatically.
                </p>

                <div className="flex justify-center gap-3">
                    <Button asChild size="lg" className="min-w-40 font-semibold transition-all duration-300">
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>
            </div>

            {/* --- OPTIMIZED PREVIEW CONTAINER --- */}
            <div className="pt-12">
                <div className="relative mx-auto max-w-5xl p-2 rounded-2xl bg-stone-200/40 dark:bg-stone-800/30 border border-stone-200/60 dark:border-stone-800/60 backdrop-blur-md shadow-2xl overflow-hidden">

                    {/* Light Mode Preview */}
                    <div className="block dark:hidden">
                        <Image
                            src="/dashboard-light.png"
                            alt="Smart Track Dashboard Light Mode"
                            width={1200}
                            height={750}
                            priority
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            // This ensures it works locally even if the optimizer is struggling
                            unoptimized={process.env.NODE_ENV === "development"}
                            className="rounded-xl border border-stone-200/50 shadow-sm object-cover w-full h-auto"
                        />
                    </div>

                    {/* Dark Mode Preview */}
                    <div className="hidden dark:block">
                        <Image
                            src="/dashboard-dark.png"
                            alt="Smart Track Dashboard Dark Mode"
                            width={1200}
                            height={750}
                            priority
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                            unoptimized={process.env.NODE_ENV === "development"}
                            className="rounded-xl border border-stone-800/50 shadow-sm object-cover w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}