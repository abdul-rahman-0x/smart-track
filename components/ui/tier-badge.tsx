import { cn } from "@/lib/utils";
import Link from "next/link";

interface TierBadgeProps {
    isPro: boolean;
    className?: string;
}

export const TierBadge = ({ isPro, className }: TierBadgeProps) => {
    if (isPro) {
        return (
            <div className={cn(
                "group relative flex items-center gap-2 px-2.5 py-1 rounded-md transition-all duration-300",
                "bg-stone-900 dark:bg-stone-100 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_-2px_rgba(0,0,0,0.1)]",
                "border border-stone-800 dark:border-stone-200",
                className
            )}>
                {/* Hand-crafted Status Dot */}
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>

                <span className="text-[10px] font-bold tracking-[0.05em] text-stone-50 dark:text-stone-900 uppercase">
                    PRO
                </span>
            </div>
        );
    }

    return (
        <Link
            href="/billing"
            className={cn(
                "flex items-center gap-2 px-2.5 py-1 rounded-md transition-all duration-200",
                "bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800/50",
                "border border-stone-200 dark:border-stone-800/60",
                "text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-stone-200",
                className
            )}
        >
            <div className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700 group-hover:bg-stone-400" />
            <span className="text-[10px] font-bold tracking-[0.05em] uppercase">
                BASIC
            </span>
        </Link>
    );
};