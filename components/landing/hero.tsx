"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeroMarquee } from "../hero-marquee";

interface HabitItem {
  id: string;
  title: string;
  tag: string;
  completed: boolean;
  streak: number;
}

export default function Hero() {
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: "1",
      title: "Deep Work (90m Focus Block)",
      tag: "Engineering",
      completed: true,
      streak: 14,
    },
    {
      id: "2",
      title: "Distributed Systems Reading",
      tag: "Academic",
      completed: true,
      streak: 8,
    },
    {
      id: "3",
      title: "Evening Code Review & Plan",
      tag: "Milestone",
      completed: false,
      streak: 5,
    },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  return (
    <section
      id="home"
      className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-32 pb-20 sm:pt-36"
    >
      {/* 1. Casca Tag / Badge: Crisp 4-Word Social Proof (No Border, 6px Radius) */}
      <div className="mb-5 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-[6px] bg-[#1c1b1a] px-3 py-1 text-[16px] font-normal text-[#f9f8f6]">
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
          <span className="text-[14px]">Trusted by 10,000+ builders</span>
        </div>
      </div>

      {/* 2. Balanced 2-Line Denton H1 (No Symbols, Natural Tracking) */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-[56px] font-light leading-[1.04] tracking-normal text-[#f9f8f6] sm:text-[74px] md:text-[86px] lg:text-[96px]">
          Track daily habits <br className="hidden sm:inline" />
          10x faster
        </h1>
      </div>

      {/* 3. Subtitle (Neue Montreal, Natural Line-Height & 60% Opacity) */}
      <div className="mx-auto mt-6 max-w-[580px] text-center">
        <p className="font-sans text-[15.5px] font-normal leading-[1.55] tracking-[-0.01em] text-[#f9f8f6]/60 sm:text-[16.5px]">
          Eliminate fragmented tools. Smart Track unites daily streak tracking,
          academic deadlines, and focus sessions into one calm workspace.
        </p>
      </div>

      {/* 4. Secondary CTA Button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-[7.4px] bg-[#e5e5e5] px-[16px] py-[11px] font-sans text-[14.8px] font-normal tracking-[-0.02em] text-[#0e0d0c] transition-colors duration-200 hover:bg-[#d8d8d8]"
        >
          Get started
        </Link>
      </div>

      {/* 5. Live Product Viewport */}
      <div className="relative mt-16 w-full max-w-5xl rounded-[16px] border border-white/[0.08] bg-[#161616] p-4  sm:p-7">
        {/* Workspace Window Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-3 font-sans text-[12.5px] font-medium tracking-[-0.01em] text-[#f9f8f6]">
              Smart Track Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#20201f] px-2.5 py-1 text-[11px] font-sans text-[#f9f8f6]/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#66cc63]" />
              <span>Session: 42m remaining</span>
            </div>
          </div>
        </div>

        {/* Dashboard Interior Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left Column: Interactive Habit Consistency Engine */}
          <div className="flex flex-col rounded-[12px] border border-white/[0.06] bg-[#0e0d0c] p-5 lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/40">
                  Daily Habit Engine
                </span>
                <h4 className="mt-0.5 font-sans text-[14px] font-medium text-[#f9f8f6]">
                  Active Routines
                </h4>
              </div>
              <span className="rounded-[4px] border border-[#66cc63]/30 bg-[#66cc63]/10 px-2 py-0.5 font-mono text-[11px] text-[#66cc63]">
                🔥 14-Day Streak
              </span>
            </div>

            <div className="space-y-2.5">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => toggleHabit(habit.id)}
                  className="flex w-full items-center justify-between rounded-[8px] border border-white/[0.04] bg-[#161616] p-3 text-left transition-colors duration-150 hover:bg-[#20201f]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-[4px] border text-[10px] transition-all ${habit.completed
                        ? "border-[#66cc63] bg-[#66cc63] text-[#0e0d0c] font-bold"
                        : "border-white/20 bg-transparent text-transparent"
                        }`}
                    >
                      ✓
                    </div>
                    <span
                      className={`font-sans text-[16px] tracking-[-0.01em] transition-all ${habit.completed
                        ? "text-[#f9f8f6]/50 line-through"
                        : "text-[#f9f8f6]"
                        }`}
                    >
                      {habit.title}
                    </span>
                  </div>

                  <span className="rounded bg-[#20201f] px-2 py-0.5 font-sans text-[10.5px] text-[#f9f8f6]/50">
                    {habit.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Weekly Habit Matrix (M-S) */}
            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <span className="font-sans text-[11px] text-[#f9f8f6]/50">
                Weekly Completion Rhythm
              </span>
              <div className="mt-2.5 grid grid-cols-7 gap-1.5">
                {[
                  { day: "M", done: true },
                  { day: "T", done: true },
                  { day: "W", done: true },
                  { day: "T", done: true },
                  { day: "F", done: true },
                  { day: "S", done: true },
                  { day: "S", done: false },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`h-7 w-full rounded-[4px] transition-colors ${item.done ? "bg-[#66cc63]/25" : "bg-[#20201f]"
                        }`}
                    />
                    <span className="font-mono text-[9.5px] text-[#f9f8f6]/40">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Academic Timelines & Velocity */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="rounded-[12px] border border-white/[0.06] bg-[#20201f] p-4.5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/40">
                  Deadlines &amp; Milestones
                </span>
                <span className="font-mono text-[11px] text-[#f9f8f6]/60">2 Pending</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-[6px] border border-white/[0.04] bg-[#161616] p-2.5">
                  <div>
                    <p className="font-sans text-[12.5px] font-medium text-[#f9f8f6]">
                      Distributed Systems Final
                    </p>
                    <span className="font-mono text-[10.5px] text-[#f9f8f6]/40">
                      Exam Prep • Dec 4
                    </span>
                  </div>
                  <span className="rounded bg-[#66cc63]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#66cc63]">
                    In 3 days
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-[6px] border border-white/[0.04] bg-[#161616] p-2.5">
                  <div>
                    <p className="font-sans text-[12.5px] font-medium text-[#f9f8f6]">
                      Stripe Webhook Handlers
                    </p>
                    <span className="font-mono text-[10.5px] text-[#f9f8f6]/40">
                      Engineering • v2 Launch
                    </span>
                  </div>
                  <span className="rounded bg-[#20201f] px-2 py-0.5 font-mono text-[10.5px] text-[#f9f8f6]/60">
                    In 6 days
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between rounded-[12px] border border-white/[0.06] bg-[#20201f] p-4.5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] font-normal uppercase tracking-wider text-[#f9f8f6]/40">
                    Weekly Focus Time
                  </span>
                  <span className="font-mono text-[10.5px] text-[#66cc63]">+14% vs last week</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-light text-[#f9f8f6]">
                    19.4 hrs
                  </span>
                  <span className="font-sans text-[11.5px] text-[#f9f8f6]/50">
                    logged
                  </span>
                </div>
              </div>

              <div className="mt-3 flex h-8 w-full items-end">
                <svg
                  className="h-full w-full text-[#66cc63]"
                  viewBox="0 0 100 20"
                  fill="none"
                  stroke="currentColor"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 16 C20 14, 40 18, 60 6 C80 0, 90 4, 100 2"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="2" r="2.5" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Partner Marquee */}
      <div className="mt-16 w-full">
        <HeroMarquee />
      </div>
    </section>
  );
}
