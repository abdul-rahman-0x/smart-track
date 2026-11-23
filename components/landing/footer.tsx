import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

interface FooterLink {
    label: string;
    href: string;
}

const footerLinks: {
    resources: FooterLink[];
    legal: FooterLink[];
} = {
    resources: [
        { label: "Sign in", href: "/login" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Planner", href: "/planner" },
        { label: "Billing", href: "/billing" },
    ],
    legal: [
        { label: "Terms of service", href: "/terms" },
        { label: "Privacy policy", href: "/privacy" },
    ],
};

export default function Footer() {
    return (
        <footer className="w-full pt-16 pb-16 sm:pt-24 sm:pb-20">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* 1. Flat Casca CTA Card (Zero Muddy Shadows) */}
                <div className="relative overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#161616] px-6 py-16 text-center sm:px-12 sm:py-24">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="font-serif text-3xl font-light leading-[1.08] tracking-normal text-[#f9f8f6] sm:text-5xl lg:text-[52px]">
                            It&apos;s time to get started with Smart Track
                        </h2>

                        <p className="mx-auto mt-5 max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                            Join thousands of students, developers, and creators building compounding daily consistency without cognitive clutter.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <Button asChild variant="secondary" size="lg">
                                <Link href="/login">Start for free</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Footer Navigation (Only Real, Functional Routes) */}
                <div className="mt-20 flex flex-col justify-between gap-12 border-t border-white/[0.06] pt-16 md:flex-row md:items-start">
                    {/* Brand Anchor & Copyright */}
                    <div className="max-w-xs space-y-3.5">
                        <Link
                            href="/#home"
                            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
                        >
                            <Logo className="h-5 w-5 text-[#66cc63]" />
                            <span className="font-sans text-[15px] font-medium tracking-[-0.02em] text-[#f9f8f6]">
                                smart track
                            </span>
                        </Link>
                        <p className="font-sans text-[16px] leading-relaxed text-[#f9f8f6]/50">
                            A minimalist productivity workspace combining task velocity,
                            habit streaks, and academic milestones in one calm canvas.
                        </p>
                        <div className="pt-2 font-sans text-[12px] text-[#f9f8f6]/40">
                            © Smart Track, Inc. 2026
                        </div>
                    </div>

                    {/* Genuine App Links */}
                    <div className="flex gap-16 sm:gap-24">
                        {/* Resources */}
                        <div className="space-y-4">
                            <div className="font-sans text-[16px] font-normal text-[#f9f8f6]">
                                Resources
                            </div>
                            <ul className="space-y-2.5">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="font-sans text-[14px] text-[#f9f8f6]/55 transition-colors duration-200 hover:text-[#f9f8f6]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="space-y-4">
                            <div className="font-sans text-[16px] font-normal text-[#f9f8f6]">
                                Legal
                            </div>
                            <ul className="space-y-2.5">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="font-sans text-[14px] text-[#f9f8f6]/55 transition-colors duration-200 hover:text-[#f9f8f6]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
