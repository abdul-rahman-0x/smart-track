import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">

        {/* 1. Badge UI */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-[6px] bg-[#1c1b1a] px-3 py-1 text-[#f9f8f6]">
            <div className="h-4 w-4 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 16 17"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <mask
                  id="mask_hero_shield"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="16"
                  height="17"
                >
                  <rect y="0.5" width="16" height="16" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask_hero_shield)">
                  <path
                    d="M7.06683 11.5667L11.7668 6.86668L10.8335 5.93334L7.06683 9.70001L5.16683 7.80001L4.2335 8.73334L7.06683 11.5667ZM8.00016 15.1667C7.07794 15.1667 6.21127 14.9917 5.40016 14.6417C4.58905 14.2917 3.8835 13.8167 3.2835 13.2167C2.6835 12.6167 2.2085 11.9111 1.8585 11.1C1.5085 10.2889 1.3335 9.42223 1.3335 8.50001C1.3335 7.57779 1.5085 6.71112 1.8585 5.90001C2.2085 5.0889 2.6835 4.38334 3.2835 3.78334C3.8835 3.18334 4.58905 2.70834 5.40016 2.35834C6.21127 2.00834 7.07794 1.83334 8.00016 1.83334C8.92238 1.83334 9.78905 2.00834 10.6002 2.35834C11.4113 2.70834 12.1168 3.18334 12.7168 3.78334C13.3168 4.38334 13.7918 5.0889 14.1418 5.90001C14.4918 6.71112 14.6668 7.57779 14.6668 8.50001C14.6668 9.42223 14.4918 10.2889 14.1418 11.1C13.7918 11.9111 13.3168 12.6167 12.7168 13.2167C12.1168 13.8167 11.4113 14.2917 10.6002 14.6417C9.78905 14.9917 8.92238 15.1667 8.00016 15.1667Z"
                    fill="#66CC63"
                  />
                </g>
              </svg>
            </div>
            <span className="font-sans text-[13.5px] font-normal tracking-[-0.01em]">
              Trusted by 10,000+ engineers
            </span>
          </div>
        </div>

        {/* 2. Headline: Responsive Scale Without Forced Line Overflow */}
        <h1 className="mx-auto max-w-5xl font-serif text-[44px] font-light leading-[1.04] tracking-[-0.035em] text-[#f9f8f6] sm:text-[68px] sm:leading-[1.0] md:text-[84px] md:leading-[0.98] lg:text-[98px] lg:leading-[0.95] xl:text-[104px] [text-wrap:balance]">
          Consolidate daily <br className="hidden sm:inline" />
          execution 10x faster
        </h1>

        {/* 3. Subtitle: Proportioned Max-Width */}
        <p className="mx-auto mt-6 max-w-xl font-sans text-[15px] font-normal leading-[1.65] text-[#f9f8f6]/60 sm:text-[16px] [text-wrap:balance]">
          Engineers and academic researchers rely on Smart Track to unite task velocity, daily habit momentum, and subscription overhead in one zero-latency canvas.
        </p>

        {/* 4. Action Row */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            size="lg"
            className="h-10 rounded-[7.4px] bg-[#f9f8f6] px-6 font-sans text-[13.5px] font-medium tracking-[-0.02em] text-[#0e0d0c] transition-all duration-150 hover:bg-white hover:opacity-90"
          >
            <Link href="/login">Get started</Link>
          </Button>

          <Link
            href="/#about"
            className="inline-flex h-10 items-center gap-1.5 rounded-[7.4px] bg-[#1a1918] px-4 font-sans text-[13.5px] font-normal tracking-[-0.015em] text-[#f9f8f6]/80 transition-colors hover:bg-[#222120] hover:text-[#f9f8f6]"
          >
            <span>Read architecture</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#f9f8f6]/50"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 5. High-Density Mockup */}
        <div className="relative mt-16 w-full max-w-5xl overflow-hidden rounded-[16px]  bg-[#141413]">
          {/* OS Title Bar */}
          <div className="flex h-10 w-full items-center justify-between border-b border-white/[0.06] bg-[#181817] px-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-2 font-sans text-[12px] font-medium tracking-[-0.01em] text-[#f9f8f6]/60">
                smart track workspace
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full  bg-[#1f1e1d] px-2.5 py-0.5 text-[11px] text-[#f9f8f6]/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#66cc63] animate-pulse" />
                <span>Session: 42m remaining</span>
              </span>
            </div>
          </div>

          {/* Three-Column Operational Grid */}
          <div className="grid grid-cols-1 gap-6 p-6 text-left md:grid-cols-12 md:p-8">

            {/* Column 1: Habit Engine */}
            <div className="space-y-4 md:col-span-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-medium tracking-wider text-[#f9f8f6]/40 uppercase">
                    Daily habit engine
                  </span>
                  <div className="font-sans text-[14px] font-medium text-[#f9f8f6]">
                    Active routines
                  </div>
                </div>
                <span className="rounded-full  bg-[#1e1d1c] px-2.5 py-0.5 text-[11px] text-[#f9f8f6]/75">
                  🔥 14-day streak
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px] text-[#f9f8f6] transition-colors hover:border-white/[0.14]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#66cc63]/15 text-[10px] text-[#66cc63]">
                      ✓
                    </span>
                    <span>Deep work (90m block)</span>
                  </div>
                  <span className="text-[11.5px] text-[#f9f8f6]/40">Engineering</span>
                </div>

                <div className="flex items-center justify-between rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px] text-[#f9f8f6] transition-colors hover:border-white/[0.14]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#66cc63]/15 text-[10px] text-[#66cc63]">
                      ✓
                    </span>
                    <span>Distributed systems review</span>
                  </div>
                  <span className="text-[11.5px] text-[#f9f8f6]/40">Academic</span>
                </div>

                <div className="flex items-center justify-between rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px] text-[#f9f8f6]/60 transition-colors hover:border-white/[0.14]">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-[4px] border border-white/[0.2]" />
                    <span>Evening schema sync</span>
                  </div>
                  <span className="text-[11.5px] text-[#f9f8f6]/40">Milestone</span>
                </div>
              </div>
            </div>

            {/* Column 2: Milestone Timelines */}
            <div className="space-y-4 md:col-span-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-medium tracking-wider text-[#f9f8f6]/40 uppercase">
                    Timelines
                  </span>
                  <div className="font-sans text-[14px] font-medium text-[#f9f8f6]">
                    Upcoming deliverables
                  </div>
                </div>
                <span className="text-[11px] text-[#f9f8f6]/50">2 active</span>
              </div>

              <div className="space-y-2">
                <div className="rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px] transition-colors hover:border-white/[0.14]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#f9f8f6]">
                      Distributed systems final
                    </span>
                    <span className="rounded bg-[#66cc63]/10 px-2 py-0.5 text-[10.5px] font-medium text-[#66cc63]">
                      In 3 days
                    </span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-[#f9f8f6]/40">
                    Exam prep • 85% ready
                  </div>
                </div>

                <div className="rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px] transition-colors hover:border-white/[0.14]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#f9f8f6]">
                      Stripe webhook pipeline
                    </span>
                    <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[10.5px] font-medium text-[#f9f8f6]/60">
                      In 6 days
                    </span>
                  </div>
                  <div className="mt-1 text-[11.5px] text-[#f9f8f6]/40">
                    Production v2 release
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Subscription Auditor */}
            <div className="space-y-4 md:col-span-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-medium tracking-wider text-[#f9f8f6]/40 uppercase">
                    Auditor
                  </span>
                  <div className="font-sans text-[14px] font-medium text-[#f9f8f6]">
                    Monthly burn
                  </div>
                </div>
                <span className="rounded bg-[#b42318]/15 px-2 py-0.5 text-[10.5px] font-medium text-[#f87171]">
                  1 leak
                </span>
              </div>

              <div className="rounded-[8px] border border-white/[0.06] bg-[#181817] p-3 text-[13px]">
                <div className="font-serif text-[22px] font-light text-[#f9f8f6]">
                  $9<span className="font-sans text-[12px] text-[#f9f8f6]/40">/mo</span>
                </div>
                <div className="mt-1 text-[11.5px] leading-relaxed text-[#f9f8f6]/50">
                  3 active services detected across GitHub, Neon, and AWS.
                </div>
                <div className="mt-2 text-[11px] text-[#66cc63]">
                  ✓ Stripe billing verified
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
