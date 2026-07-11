"use client";

import React from "react";

const FEATURES = [
    {
        name: "Habits",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12l5 5L20 7"
                />
            </svg>
        ),
    },
    {
        name: "Tasks",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
                />
            </svg>
        ),
    },
    {
        name: "Focus Sessions",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7v5l3 2"
                />
            </svg>
        ),
    },
    {
        name: "Goals",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: "Journal",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 4h9a3 3 0 013 3v13H9a3 3 0 00-3 3V4z"
                />
            </svg>
        ),
    },
    {
        name: "Calendar",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
            </svg>
        ),
    },
    {
        name: "Analytics",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 19h16M7 16V9M12 16V5M17 16v-7"
                />
            </svg>
        ),
    },
    {
        name: "Streaks",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2c1 3 5 5 5 10a5 5 0 11-10 0c0-2.5 1.5-4.5 5-10z"
                />
            </svg>
        ),
    },
    {
        name: "Notes",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
        ),
    },
    {
        name: "Projects",
        icon: (
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7h7l2 2h9v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
            </svg>
        ),
    },
];

export function HeroMarquee() {
    const marqueeItems = [...FEATURES, ...FEATURES, ...FEATURES];

    return (
        <div className="relative z-20 w-full overflow-hidden bg-transparent py-4 mt-8 md:mt-12">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes marquee {
                            0% {
                                transform: translate3d(0,0,0);
                            }
                            100% {
                                transform: translate3d(-33.3333%,0,0);
                            }
                        }

                        .animate-marquee-infinite {
                            animation: marquee 35s linear infinite;
                        }
                    `,
                }}
            />

            <div
                className="flex w-full"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                }}>
                <div className="animate-marquee-infinite flex min-w-max gap-16 pr-16 whitespace-nowrap">
                    {marqueeItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-muted-foreground/50 hover:text-foreground/80 transition-colors duration-200">
                            {item.icon}

                            <span className="text-lg font-semibold tracking-wide font-sans">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
