import React from "react";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}>
            {/* 1. Outer Rounded Badge */}
            <rect
                x="5"
                y="5"
                width="90"
                height="90"
                rx="24"
                className="fill-stone-950 dark:fill-stone-50"
            />

            {/* 2. Inner Contrasting Circle Mask */}
            <circle
                cx="50"
                cy="50"
                r="32"
                className="fill-stone-50 dark:fill-stone-950"
            />

            {/* 3. The Bold Silhouette: Graduation Cap + Timeline */}
            {/* Calendar Grid Base */}
            <path
                d="M32 50H68V64C68 66 66 68 64 68H36C34 68 32 66 32 64V50Z"
                className="fill-stone-950 dark:fill-stone-50"
            />

            {/* Grid Lines inside the base */}
            <line
                x1="44"
                y1="50"
                x2="44"
                y2="68"
                className="stroke-stone-50 dark:stroke-stone-950"
                strokeWidth="3.5"
            />
            <line
                x1="56"
                y1="50"
                x2="56"
                y2="68"
                className="stroke-stone-50 dark:stroke-stone-950"
                strokeWidth="3.5"
            />
            <line
                x1="32"
                y1="59"
                x2="68"
                y2="59"
                className="stroke-stone-50 dark:stroke-stone-950"
                strokeWidth="3.5"
            />

            {/* Cap Diamond Top */}
            <path
                d="M50 26L72 35L50 44L28 35L50 26Z"
                className="fill-stone-950 dark:fill-stone-50"
            />

            {/* Cap Tassel */}
            <path
                d="M72 35V45L74 48"
                className="stroke-stone-950 dark:stroke-stone-50"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
