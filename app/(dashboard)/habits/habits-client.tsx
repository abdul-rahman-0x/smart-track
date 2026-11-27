"use client";

import React, { useState, useMemo, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    createHabit,
    toggleHabitDate,
    deleteHabit,
    resetWeekCompletions,
} from "./actions";
import {
    Flame,
    Check,
    Trash2,
    Plus,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Sparkles,
    TrendingUp,
    Activity,
    Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Habit {
    id: string;
    name: string;
    category?: string | null;
    streak: number;
}

interface Completion {
    id: string;
    habitId: string;
    completedAt: Date | string;
}

interface HabitsClientProps {
    selectedDateStr: string;
    initialHabits: Habit[];
    initialCompletions: Completion[];
}

type OptimisticAction =
    | { type: "TOGGLE"; habitId: string; dateKey: string }
    | { type: "DELETE"; habitId: string }
    | { type: "RESET_WEEK"; dateKeys: string[] };

const CATEGORIES = ["Deep Work", "Engineering", "Health", "Discipline"] as const;

// Safe local date normalization to eliminate UTC shifts
function parseLocalYYYYMMDD(dateStr: string): Date {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    return isNaN(date.getTime()) ? new Date() : date;
}

function toLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function HabitsClient({
    selectedDateStr,
    initialHabits,
    initialCompletions,
}: HabitsClientProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const [newHabitName, setNewHabitName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Deep Work");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResetConfirming, setIsResetConfirming] = useState(false);

    // Compute Monday-anchored 7-day window strictly in local client time
    const today = useMemo(() => new Date(), []);
    const todayKey = useMemo(() => toLocalDateKey(today), [today]);

    const selectedDate = useMemo(
        () => parseLocalYYYYMMDD(selectedDateStr),
        [selectedDateStr]
    );

    const { weekDays, weekRangeLabel, isCurrentWeek, mondayKey } = useMemo(() => {
        const dayOfWeek = selectedDate.getDay();
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(selectedDate);
        monday.setDate(selectedDate.getDate() + distanceToMonday);

        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });

        const isCurr = days.some((d) => toLocalDateKey(d) === todayKey);
        const rangeLabel = `${monday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        })} – ${days[6].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })}`;

        return {
            weekDays: days,
            weekRangeLabel: rangeLabel,
            isCurrentWeek: isCurr,
            mondayKey: toLocalDateKey(monday),
        };
    }, [selectedDate, todayKey]);

    // Optimistic UI for completions & habits
    const [optimisticCompletions, setOptimisticCompletions] = useOptimistic(
        initialCompletions,
        (state: Completion[], action: OptimisticAction) => {
            switch (action.type) {
                case "TOGGLE": {
                    const exists = state.some(
                        (c) =>
                            c.habitId === action.habitId &&
                            toLocalDateKey(new Date(c.completedAt)) === action.dateKey
                    );
                    if (exists) {
                        return state.filter(
                            (c) =>
                                !(
                                    c.habitId === action.habitId &&
                                    toLocalDateKey(new Date(c.completedAt)) === action.dateKey
                                )
                        );
                    }
                    return [
                        ...state,
                        {
                            id: `temp-${Date.now()}`,
                            habitId: action.habitId,
                            completedAt: action.dateKey,
                        },
                    ];
                }
                case "RESET_WEEK":
                    return state.filter(
                        (c) => !action.dateKeys.includes(toLocalDateKey(new Date(c.completedAt)))
                    );
                default:
                    return state;
            }
        }
    );

    const [optimisticHabits, setOptimisticHabits] = useOptimistic(
        initialHabits,
        (state: Habit[], action: OptimisticAction) => {
            if (action.type === "DELETE") {
                return state.filter((h) => h.id !== action.habitId);
            }
            return state;
        }
    );

    // Macro metrics
    const weekStats = useMemo(() => {
        const totalPotentialSlots = optimisticHabits.length * 7;
        const weekDateKeys = new Set(weekDays.map(toLocalDateKey));
        const completionsThisWeek = optimisticCompletions.filter((c) =>
            weekDateKeys.has(toLocalDateKey(new Date(c.completedAt)))
        ).length;

        const rate =
            totalPotentialSlots > 0
                ? Math.round((completionsThisWeek / totalPotentialSlots) * 100)
                : 0;

        return { completionsThisWeek, totalPotentialSlots, rate };
    }, [optimisticHabits, optimisticCompletions, weekDays]);

    const handleNavigate = (direction: "prev" | "next") => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
        router.push(`/habits?date=${toLocalDateKey(nextDate)}`);
    };

    const handleToggle = (habitId: string, dateKey: string) => {
        startTransition(async () => {
            setOptimisticCompletions({ type: "TOGGLE", habitId, dateKey });
            try {
                await toggleHabitDate(habitId, dateKey);
            } catch {
                toast.error("Failed to sync habit mark. Rolling back.");
            }
        });
    };

    const handleDelete = (habitId: string) => {
        startTransition(async () => {
            setOptimisticHabits({ type: "DELETE", habitId });
            try {
                await deleteHabit(habitId);
                toast.success("Routine purged from ledger");
            } catch {
                toast.error("Failed to delete routine.");
            }
        });
    };

    const handleResetWeek = async () => {
        const weekKeys = weekDays.map(toLocalDateKey);
        setIsResetConfirming(false);
        startTransition(async () => {
            setOptimisticCompletions({ type: "RESET_WEEK", dateKeys: weekKeys });
            try {
                await resetWeekCompletions(mondayKey);
                toast.success("Current week cleared");
            } catch {
                toast.error("Failed to reset week.");
            }
        });
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = newHabitName.trim();
        if (!cleanName || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await createHabit(cleanName);
            setNewHabitName("");
            toast.success("Habit routine established");
        } catch {
            toast.error("Failed to register habit.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 pb-16 max-w-7xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header & Controls */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            Habit Ledger & Velocity
                        </h1>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9F8F6]/60 bg-[#161616] px-2 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08]">
                            DISCIPLINE
                        </span>
                    </div>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        Systematic consistency tracker for high-performance routines.
                    </p>
                </div>

                {/* Week Switcher & Action Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {!isCurrentWeek && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/habits?date=${todayKey}`)}
                            className="text-xs font-mono h-8 border-[#F9F8F6]/[0.12] text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            Current Week
                        </Button>
                    )}

                    <div className="flex items-center bg-[#161616] border border-[#F9F8F6]/[0.08] rounded-[8px] p-0.5">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Previous week"
                            onClick={() => handleNavigate("prev")}
                            className="size-7 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <span className="text-xs font-mono font-medium px-3 text-[#F9F8F6] tabular-nums select-none">
                            {weekRangeLabel}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Next week"
                            onClick={() => handleNavigate("next")}
                            className="size-7 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    {/* Non-blocking inline reset confirmation */}
                    {isResetConfirming ? (
                        <div className="flex items-center gap-1.5 bg-[#161616] border border-[#B42318]/40 p-1 rounded-[8px]">
                            <span className="text-[11px] font-mono text-[#F87171] px-1.5">Reset all?</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleResetWeek}
                                className="h-6 px-2 text-[10px] font-mono rounded-[4px]"
                            >
                                Yes
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsResetConfirming(false)}
                                className="h-6 px-1.5 text-[10px] font-mono text-[#F9F8F6]/60 rounded-[4px]"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => setIsResetConfirming(true)}
                            title="Reset current week records"
                            className="size-8 rounded-[8px] border-[#F9F8F6]/[0.1] text-[#F9F8F6]/40 hover:text-[#F87171] hover:border-[#F87171]/40 hover:bg-[#B42318]/10"
                        >
                            <RotateCcw className="size-3.5" />
                        </Button>
                    )}
                </div>
            </header>

            {/* Analytics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricStrip
                    label="Adherence Velocity"
                    value={`${weekStats.rate}%`}
                    detail={`${weekStats.completionsThisWeek} slots logged this week`}
                    highlight
                />
                <MetricStrip
                    label="Tracked Routines"
                    value={optimisticHabits.length.toString()}
                    detail="Active commitment streams"
                />
                <MetricStrip
                    label="Maximum Streak"
                    value={`${Math.max(0, ...optimisticHabits.map((h) => h.streak))}d`}
                    detail="Historical uninterrupted run"
                />
                <MetricStrip
                    label="Weekly Quota"
                    value={`${weekStats.totalPotentialSlots}`}
                    detail="Total planned check-ins"
                />
            </div>

            {/* Main Habits Ledger Surface */}
            <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] overflow-hidden">
                {/* Table Column Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#20201F]/40 border-b border-[#F9F8F6]/[0.06] text-xs font-mono uppercase tracking-wider text-[#F9F8F6]/60">
                    <div className="col-span-4">Habit Specification</div>
                    <div className="col-span-5 grid grid-cols-7 gap-2 text-center">
                        {weekDays.map((day) => {
                            const isToday = toLocalDateKey(day) === todayKey;
                            return (
                                <div
                                    key={toLocalDateKey(day)}
                                    className={cn(
                                        "py-1 rounded-[6px] transition-colors",
                                        isToday ? "bg-[#20201F] text-[#F9F8F6] border border-[#F9F8F6]/20 font-bold" : "text-[#F9F8F6]/40"
                                    )}
                                >
                                    <span className="block text-[10px]">
                                        {day.toLocaleDateString("en-US", { weekday: "narrow" })}
                                    </span>
                                    <span className="text-[12px] tabular-nums">
                                        {day.getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-3 text-right">Momentum</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-[#F9F8F6]/[0.04]">
                    {optimisticHabits.length > 0 ? (
                        optimisticHabits.map((habit) => {
                            const habitCompletions = optimisticCompletions.filter(
                                (c) => c.habitId === habit.id
                            );
                            const completedDateKeys = new Set(
                                habitCompletions.map((c) => toLocalDateKey(new Date(c.completedAt)))
                            );

                            const completedDaysCount = weekDays.filter((d) =>
                                completedDateKeys.has(toLocalDateKey(d))
                            ).length;
                            const rate = Math.round((completedDaysCount / 7) * 100);

                            return (
                                <div
                                    key={habit.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 sm:px-6 hover:bg-[#20201F]/30 transition-colors group"
                                >
                                    {/* Routine Info */}
                                    <div className="col-span-1 md:col-span-4 flex items-center justify-between gap-3 min-w-0 pr-2">
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-sans font-medium text-[#F9F8F6] truncate">
                                                    {habit.name}
                                                </span>
                                                {habit.category && (
                                                    <span className="text-[10px] font-mono text-[#F9F8F6]/40 bg-[#20201F] px-1.5 py-0.2 rounded-[4px] border border-[#F9F8F6]/[0.06]">
                                                        {habit.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#FBBF24]">
                                                <Flame className="size-3.5 fill-current" />
                                                <span>{habit.streak}d streak</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(habit.id)}
                                            className="size-7.5 rounded-[6px] flex items-center justify-center text-[#F9F8F6]/20 hover:text-[#F87171] hover:bg-[#B42318]/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            aria-label="Delete habit"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>

                                    {/* 7-Day Checklist Matrix */}
                                    <div className="col-span-1 md:col-span-5 grid grid-cols-7 gap-2 text-center">
                                        {weekDays.map((day) => {
                                            const dateKey = toLocalDateKey(day);
                                            const isCompleted = completedDateKeys.has(dateKey);
                                            const isToday = dateKey === todayKey;

                                            return (
                                                <div key={dateKey} className="flex flex-col items-center gap-1">
                                                    {/* Mobile Day Label */}
                                                    <span className="block md:hidden text-[10px] font-mono text-[#F9F8F6]/40">
                                                        {day.toLocaleDateString("en-US", { weekday: "narrow" })}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(habit.id, dateKey)}
                                                        aria-label={`${habit.name} on ${dateKey}`}
                                                        className={cn(
                                                            "size-8 rounded-[6px] border flex items-center justify-center transition-all active:scale-95 outline-none",
                                                            isCompleted
                                                                ? "bg-[#66CC63] border-[#66CC63] text-[#0E0D0C] font-bold"
                                                                : "bg-[#20201F]/60 border-[#F9F8F6]/[0.08] hover:border-[#F9F8F6]/30 hover:bg-[#20201F]",
                                                            isToday && !isCompleted && "ring-1 ring-[#F9F8F6]/50"
                                                        )}
                                                    >
                                                        {isCompleted && <Check className="size-4 stroke-[2.5]" />}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Weekly Velocity Progress Bar */}
                                    <div className="col-span-1 md:col-span-3 flex flex-col items-start md:items-end gap-1.5">
                                        <div className="flex items-center gap-2 text-xs font-mono">
                                            <span className="text-[#F9F8F6] font-medium">{completedDaysCount}/7</span>
                                            <span className="text-[#F9F8F6]/40">({rate}%)</span>
                                        </div>
                                        <div className="w-full md:w-36 bg-[#20201F] h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-300",
                                                    completedDaysCount === 7 ? "bg-[#66CC63]" : "bg-[#F9F8F6]/80"
                                                )}
                                                style={{ width: `${(completedDaysCount / 7) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center space-y-2">
                            <Sparkles className="size-6 text-[#F9F8F6]/20 mx-auto" />
                            <h3 className="text-sm font-medium text-[#F9F8F6]">
                                No routines active in ledger
                            </h3>
                            <p className="text-xs font-sans text-[#F9F8F6]/50 max-w-sm mx-auto">
                                Add high-impact execution habits below to begin tracking consistency trends.
                            </p>
                        </div>
                    )}
                </div>

                {/* Inline Habit Addition Footer */}
                <div className="p-4 sm:p-5 border-t border-[#F9F8F6]/[0.06] bg-[#0E0D0C]/40">
                    <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Define habit routine (e.g. 90m Architecture Review, Gym, LeetCode)..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            required
                            className="h-10 text-sm bg-[#161616] border-[#F9F8F6]/[0.08] text-[#F9F8F6] placeholder:text-[#F9F8F6]/40 rounded-[8px] focus-visible:ring-1 focus-visible:ring-[#F9F8F6]/30 flex-1"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!newHabitName.trim() || isSubmitting}
                            className="bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] font-sans font-medium h-10 px-5 text-xs rounded-[8px] shrink-0"
                        >
                            <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                            Establish Routine
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function MetricStrip({
    label,
    value,
    detail,
    highlight = false,
}: {
    label: string;
    value: string;
    detail: string;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-[12px] bg-[#161616] border border-[#F9F8F6]/[0.08] p-3.5 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#F9F8F6]/60 block">
                {label}
            </span>
            <span
                className={cn(
                    "text-xl font-mono font-medium tracking-tight block",
                    highlight ? "text-[#66CC63]" : "text-[#F9F8F6]"
                )}
            >
                {value}
            </span>
            <span className="text-[10px] font-mono text-[#F9F8F6]/40 block truncate">
                {detail}
            </span>
        </div>
    );
}
