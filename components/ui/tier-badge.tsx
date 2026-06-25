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
                "group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-500 select-none",
                // LIGHT MODE: Deep obsidian look with a top-down light "edge"
                "bg-stone-950 text-stone-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_10px_-2px_rgba(0,0,0,0.3)]",
                // DARK MODE: Solid ivory with a heavy internal recess (visible without zoom)
                "dark:bg-stone-100 dark:text-stone-950 dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_10px_20px_-5px_rgba(0,0,0,0.5)]",
                className
            )}>
                {/* Visual Status Indicator: Enhanced for visibility in all modes */}
                <div className="relative flex items-center justify-center h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 dark:bg-orange-500 opacity-100"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                </div>

                <span className="text-[9px] font-black tracking-[0.1em] uppercase antialiased">
                    PRO
                </span>
            </div>
        );
    }

    return (
        <Link
            href="/billing"
            className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-300 group",
                // BASIC STATE: Looks like a "hollowed out" slot in the UI
                "bg-stone-100/80 dark:bg-stone-900/80",
                "shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]",
                "text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-stone-100",
                "hover:shadow-none hover:translate-y-[-1px] active:translate-y-[0px]",
                className
            )}
        >
            <div className="h-1.5 w-1.5 rounded-full bg-stone-300 dark:bg-stone-700 transition-colors group-hover:bg-stone-500 dark:group-hover:bg-stone-400" />
            <span className="text-[9px] font-bold tracking-[0.1em] uppercase">
                BASIC
            </span>
        </Link>
    );
};