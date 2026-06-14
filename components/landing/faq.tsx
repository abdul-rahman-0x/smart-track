"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionBadge } from "@/components/section-badge";

// Structured 7-item general productivity FAQ array
const FAQ_ITEMS = [
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
        a: "Our base planner is completely free to use forever. For users seeking unlimited tasks, habits, and Google Calendar sync, our Pro tier is priced at an accessible rate of just $3/month, with an additional 20% discount on annual commitments.",
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
        // Restored to max-w-4xl to prevent compressed text lines
        <section className="max-w-4xl mx-auto px-4 py-20 space-y-12">
            {/* --- SECTION HEADER (Updated to match LowrCarbon template) --- */}
            <div className="text-center space-y-4">
                <SectionBadge>FAQ</SectionBadge>

                <h3 className="font-serif font-medium text-3xl sm:text-4xl tracking-[-0.04em] leading-[1.1] text-stone-900 dark:text-white">
                    Frequently asked questions
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                    In case you missed anything and have some more questions.
                </p>
            </div>

            {/* --- ACCORDION GRID --- */}
            <div className="divide-y divide-stone-200/60 dark:divide-stone-800/60 border-t border-b border-stone-200/60 dark:border-stone-800/60">
                {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div key={idx} className="py-5">
                            <button
                                onClick={() => toggleFAQ(idx)}
                                className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer group">
                                {/* Implements IBM Plex Serif typography globally on questions */}
                                <h4 className="font-serif font-medium text-sm sm:text-base pr-4 text-stone-900 dark:text-stone-100">
                                    {item.q}
                                </h4>

                                {/* Rotating chevron transition matching the template */}
                                <ChevronDown
                                    className={`w-4 h-4 shrink-0 text-stone-400 dark:text-stone-600 transition-transform duration-300 ease-in-out ${
                                        isOpen
                                            ? "transform rotate-180 text-orange-500"
                                            : "group-hover:text-stone-600 dark:group-hover:text-stone-300"
                                    }`}
                                />
                            </button>

                            {/* Smooth height sliding panel transition */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isOpen
                                        ? "max-h-40 opacity-100 mt-3"
                                        : "max-h-0 opacity-0"
                                }`}>
                                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed pb-1">
                                    {item.a}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
