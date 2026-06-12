"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

// The 5 academic questions defined exactly in your blueprint
const FAQ_ITEMS = [
    {
        q: "How does the dynamic planner differ from a standard digital calendar?",
        a: "Standard calendars only hold dates. Smart Track actively maps your exam milestones, breaks down syllabus topics into bite-sized chapters, and dynamically integrates them into your daily task list to prevent cramming.",
    },
    {
        q: "Can I sync my class timetables or external calendar feeds?",
        a: "Yes. Smart Track allows you to import external calendar feeds (including iCal/Google Calendar) so that your classes, assignment deadlines, and personal study blocks are unified in a single dashboard.",
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
        q: "Can I cancel or change my plan at any time?",
        a: "Absolutely. Through the self-service Stripe billing portal within the app, you can upgrade, downgrade, or cancel your Pro membership instantly with no hidden fees or contracts.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight">
                    All you need to know about Smart Track
                </h3>
                <p className="text-sm text-stone-500">
                    Still can&apos;t find what you are looking for? Contact us.
                </p>
            </div>

            <div className="divide-y divide-stone-200/60 dark:divide-stone-800/60 border-t border-b border-stone-200/60 dark:border-stone-800/60">
                {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div key={idx} className="py-5">
                            <button
                                onClick={() => toggleFAQ(idx)}
                                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base focus:outline-none">
                                <span>{item.q}</span>
                                {isOpen ? (
                                    <Minus className="w-4 h-4 text-orange-500" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
                            {isOpen && (
                                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-3 leading-relaxed">
                                    {item.a}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
