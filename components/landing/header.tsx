import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";

export default async function Header() {
  const session = await auth();

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col bg-[#0e0d0c]/90 backdrop-blur-md">
      {/* 1. Top Announcement Bar (Points to Metrics & Comparison: #about) */}
      <div className="flex h-9 w-full items-center justify-center border-b border-white/[0.06] px-4 text-[12px] font-normal tracking-[-0.01em] text-[#f9f8f6]/60">
        <div className="flex items-center gap-2 truncate">
          <span className="font-medium text-[#f9f8f6]">Productivity Architecture:</span>
          <span className="hidden sm:inline">
            See how Smart Track eliminates daily planning fatigue.
          </span>
          <Link
            href="#about"
            className="flex items-center gap-1 text-[#f9f8f6] hover:underline"
          >
            <span>View comparison</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/#home"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <Logo className="h-5 w-5 text-[#66cc63]" />
          <span className="font-sans text-[15px] font-medium tracking-[-0.02em] text-[#f9f8f6]">
            smart track
          </span>
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="font-sans text-[14.5px] font-normal tracking-[-0.01em] text-[#f9f8f6]/60 transition-colors duration-200 hover:text-[#f9f8f6]"
          >
            Features
          </a>
          <a
            href="#about"
            className="font-sans text-[14.5px] font-normal tracking-[-0.01em] text-[#f9f8f6]/60 transition-colors duration-200 hover:text-[#f9f8f6]"
          >
            Methodology
          </a>
          <a
            href="#pricing"
            className="font-sans text-[14.5px] font-normal tracking-[-0.01em] text-[#f9f8f6]/60 transition-colors duration-200 hover:text-[#f9f8f6]"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="font-sans text-[14.5px] font-normal tracking-[-0.01em] text-[#f9f8f6]/60 transition-colors duration-200 hover:text-[#f9f8f6]"
          >
            Faq
          </a>
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center">
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex h-[32px] items-center gap-2 rounded-[7.4px] border border-white/[0.08] bg-[#20201f] px-3 font-sans text-[13px] font-normal tracking-[-0.02em] text-[#f9f8f6] transition-colors duration-200 hover:bg-[#2b2b2a]"
          >
            <span>{session ? "Dashboard" : "Request access"}</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#f9f8f6]/60"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>
    </div>
  );
}
