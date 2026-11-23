"use client";

import React, { useState } from "react";

interface FAQItem {
    q: string;
    a: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        q: "How does the dynamic planner differ from a standard digital calendar?",
        a: "Standard calendars only hold dates. Smart Track actively maps your major milestone dates, breaks down goals into bite-sized chapters, and dynamically integrates them into your daily task list to prevent cramming.",
    },
    {
        q: "Can I sync my class timetables or external calendar feeds?",
        a: "Yes. Smart Track allows you to import external calendar feeds (including iCal/Google Calendar) so that your timetables, assignment deadlines, and personal study blocks are unified in a single dashboard.",
    },
    {
        q: "Is my study data secure and private?",
        a: "Your data is secure with us. We use enterprise-grade end-to-end encryption. All records are isolated in our secure Neon PostgreSQL database, ensuring your planner notes, exam parameters, and personal schedules are visible only to you.",
    },
    {
        q: "How does Focus Mode link with my syllabus and task completion?",
        a: "When you run a Pomodoro session in Focus Mode, you can tag it with a specific exam or task. Once completed, your analytics are updated, showing you exactly how many hours of deep work you have invested in each syllabus topic.",
    },
    {
        q: "How does Stripe billing and subscription cancellation work?",
        a: "Through our integration with Stripe, billing is fully secure and automated. You can upgrade, downgrade, or cancel your Pro subscription at any time directly through your self-service billing portal with zero lock-in contracts.",
    },
    {
        q: "Is there a free trial or student discount available?",
        a: "Our base planner is completely free to use forever. For users seeking unlimited tasks, habits, and Google Calendar sync, our Pro tier is priced at an accessible rate of just $7/month billed annually ($9/month monthly).",
    },
    {
        q: "Can I access my goals and roadmaps across multiple devices?",
        a: "Yes. Smart Track is a cloud-native platform. Your data is stored securely in our serverless Neon database, allowing you to seamlessly log in from any desktop, tablet, or mobile browser to access your updated workspace.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
            {/* 1. Casca Section Header */}
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-light leading-[1.08] tracking-normal text-[#f9f8f6] sm:text-5xl lg:text-[54px]">
                    Frequently asked questions
                </h2>
                <p className="mx-auto mt-4 max-w-md font-sans text-[15.5px] font-normal leading-[1.6] text-[#f9f8f6]/60">
                    Everything you need to know about the product, sync engines, and billing infrastructure.
                </p>
            </div>

            {/* 2. Casca Accordion List */}
            <div className="mt-16 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div key={idx} className="group py-6 transition-colors">
                            <button
                                type="button"
                                onClick={() => toggleFAQ(idx)}
                                className="flex w-full items-center justify-between text-left outline-none cursor-pointer"
                                aria-expanded={isOpen}
                            >
                                {/* Question */}
                                <span className="pr-6 font-sans text-[16px] font-normal tracking-[-0.015em] text-[#f9f8f6] transition-colors duration-200 group-hover:text-white sm:text-[17px]">
                                    {item.q}
                                </span>

                                {/* Minimalist Circular Indicator */}
                                <div
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${isOpen
                                            ? "border-white/20 bg-[#20201f] text-[#f9f8f6]"
                                            : "border-white/8 bg-[#161616] text-[#f9f8f6]/40 group-hover:border-white/20 group-hover:text-[#f9f8f6]"
                                        }`}
                                >
                                    <svg
                                        className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"
                                            }`}
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    >
                                        <path d="M6 2.5v7M2.5 6h7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Grid Auto-Height Expansion */}
                            <div
                                className={`grid transition-[grid-template-rows,opacity] duration-250 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="pt-3 font-sans text-[14.5px] font-normal leading-[1.65] text-[#f9f8f6]/60 sm:text-[15px]">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
