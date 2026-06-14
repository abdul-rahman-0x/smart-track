import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function SectionBadge({
    children,
    className,
    ...props
}: SectionBadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase select-none rounded-[7px] border shrink-0",

                // Translucent Orange Glassmorphism (Light Mode)
                "bg-orange-500/10 border-orange-500/20 text-orange-600",

                // Translucent Orange Glassmorphism (Dark Mode)
                "dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400",

                // Back-drop blur effect
                "backdrop-blur-xs",

                className,
            )}
            {...props}>
            {children}
        </div>
    );
}
