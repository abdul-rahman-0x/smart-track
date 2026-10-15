"use client";

import React, { useState } from "react";
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
    Calendar as CalendarIcon,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
    id: string;
    name: string;
    category: string;
    streak: number;
}

interface Completion {
    id: string;
    habitId: string;
    completedAt: Date;
}

interface HabitsClientProps {
    selectedDateStr: string;
    initialHabits: Habit[];
    initialCompletions: Completion[];
}

export function HabitsClient({
    selectedDateStr,
    initialHabits,
    initialCompletions,
}: HabitsClientProps) {
    const router = useRouter();
    const [newHabitName, setNewHabitName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Week Calculation ---
    const selectedDate = new Date(selectedDateStr);
    const today = new Date();

    const currentDayOfWeek = selectedDate.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + distanceToMonday);

    const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day;
    });

    const isCurrentWeek = WEEK_DAYS.some(
        (day) => day.toDateString() === today.toDateString()
    );

    const weekRangeLabel = `${monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} – ${WEEK_DAYS[6].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })}`;

    const handleNavigate = (direction: "prev" | "next") => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(
            selectedDate.getDate() + (direction === "next" ? 7 : -7),
        );
        router.push(`/habits?date=${nextDate.toISOString().split("T")[0]}`);
    };

    const handleJumpToCurrentWeek = () => {
        router.push(`/habits?date=${today.toISOString().split("T")[0]}`);
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createHabit(newHabitName.trim());
            setNewHabitName("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetWeek = async () => {
        const confirm = window.confirm(
            "Are you sure you want to clear all habit checkmarks for this week?",
        );
        if (confirm) {
            await resetWeekCompletions(monday.toISOString().split("T")[0]);
        }
    };

    return (
        <div className="relative space-y-8 pb-16 max-w-7xl mx-auto">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/[0.03] blur-3xl pointer-events-none rounded-full" />

            {/* --- HEADER: Title & Week Controller --- */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                            Habit Tracker
                        </h1>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                            <Flame className="size-3 fill-current" />
                            Daily Streaks
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Build momentum through small daily repetitions.
                    </p>
                </div>

                {/* Week Navigator */}
                <div className="flex items-center gap-2.5">
                    {!isCurrentWeek && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleJumpToCurrentWeek}
                            className="h-8.5 text-xs border-border hover:bg-secondary">
                            <CalendarIcon className="size-3.5 mr-1.5" />
                            This Week
                        </Button>
                    )}

                    <div className="flex items-center bg-card border border-border/80 rounded-lg p-0.5 card-elevation">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Previous week"
                            onClick={() => handleNavigate("prev")}
                            className="size-7.5 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="size-4" />
                        </Button>

                        <span className="text-xs font-semibold px-3 text-foreground select-none tabular-nums">
                            {weekRangeLabel}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Next week"
                            onClick={() => handleNavigate("next")}
                            className="size-7.5 text-muted-foreground hover:text-foreground">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleResetWeek}
                        className="size-8.5 border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Reset this week's progress">
                        <RotateCcw className="size-3.5" />
                    </Button>
                </div>
            </div>

            {/* --- HABITS WORKSPACE GRID --- */}
            <div className="rounded-xl border border-border/90 bg-card card-elevation overflow-hidden">
                {/* Desktop Column Header */}
                <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-3.5 bg-secondary/30 border-b border-border/60 text-xs font-semibold text-muted-foreground">
                    <div className="col-span-3">Habit Routine</div>
                    <div className="col-span-5 grid grid-cols-7 gap-2 text-center">
                        {WEEK_DAYS.map((day) => {
                            const isToday = day.toDateString() === today.toDateString();
                            return (
                                <div
                                    key={day.toDateString()}
                                    className={cn(
                                        "py-1 rounded-md transition-colors",
                                        isToday && "bg-emerald-500/10 border border-emerald-500/20",
                                    )}>
                                    <span
                                        className={cn(
                                            "block uppercase tracking-wider text-[10px]",
                                            isToday ? "text-emerald-500 font-bold" : "text-muted-foreground/70",
                                        )}>
                                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-xs font-semibold",
                                            isToday ? "text-emerald-500" : "text-foreground",
                                        )}>
                                        {day.toLocaleDateString("en-US", { day: "numeric" })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-span-2 text-right">Weekly Velocity</div>
                </div>

                {/* Habit Rows */}
                <div className="divide-y divide-border/50">
                    {initialHabits.length > 0 ? (
                        initialHabits.map((habit) => {
                            const habitWeekCompletions = initialCompletions.filter(
                                (c) => c.habitId === habit.id,
                            );
                            const completionCount = habitWeekCompletions.length;
                            const percentage = Math.round((completionCount / 7) * 100);

                            return (
                                <div
                                    key={habit.id}
                                    className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center p-5 sm:p-6 hover:bg-secondary/20 transition-colors group">
                                    {/* Column 1: Habit Name & Streak */}
                                    <div className="col-span-1 md:col-span-3 flex items-center justify-between gap-3">
                                        <div className="space-y-1 min-w-0 pr-2">
                                            <p className="font-medium text-foreground truncate text-sm">
                                                {habit.name}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                                                <Flame className="size-3.5 fill-current" />
                                                <span>{habit.streak}d streak</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await deleteHabit(habit.id);
                                            }}
                                            className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                            title="Delete habit">
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>

                                    {/* Column 2: 7-Day Checklist Matrix */}
                                    <div className="col-span-1 md:col-span-5 grid grid-cols-7 gap-2 text-center">
                                        {WEEK_DAYS.map((day) => {
                                            const dateKey = day.toISOString().split("T")[0];
                                            const isCompleted = habitWeekCompletions.some(
                                                (c) =>
                                                    new Date(c.completedAt).toDateString() ===
                                                    day.toDateString(),
                                            );
                                            const isToday = day.toDateString() === today.toDateString();

                                            return (
                                                <div
                                                    key={dateKey}
                                                    className="flex flex-col items-center justify-center gap-1">
                                                    {/* Mobile weekday label */}
                                                    <span className="block md:hidden text-[9px] uppercase tracking-wider text-muted-foreground">
                                                        {day.toLocaleDateString("en-US", { weekday: "narrow" })}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            await toggleHabitDate(habit.id, dateKey);
                                                        }}
                                                        className={cn(
                                                            "size-8 rounded-lg border flex items-center justify-center transition-all active:scale-95",
                                                            isCompleted
                                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-xs shadow-emerald-500/20"
                                                                : "bg-secondary/40 border-border/80 hover:border-emerald-500/50 hover:bg-secondary/80",
                                                            isToday && !isCompleted && "ring-1 ring-emerald-500/50",
                                                        )}>
                                                        {isCompleted && (
                                                            <Check className="size-3.5 stroke-[2.5]" />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Column 3: Visual Progress Meter */}
                                    <div className="col-span-1 md:col-span-2 flex flex-col items-start md:items-end gap-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                                            <span className="text-foreground">{completionCount}/7</span>
                                            <span className="text-muted-foreground text-[10px]">
                                                ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full md:w-28 bg-secondary h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-300",
                                                    completionCount === 7 ? "bg-emerald-500" : "bg-emerald-500/80",
                                                )}
                                                style={{ width: `${(completionCount / 7) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center space-y-2">
                            <Sparkles className="size-6 text-muted-foreground/40 mx-auto" />
                            <h3 className="text-sm font-semibold text-foreground">
                                No habit routines yet
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Start by logging 1-3 foundational habits below to establish daily momentum.
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Inline Quick-Add */}
                <div className="p-4 border-t border-border/60 bg-secondary/10">
                    <form onSubmit={handleAddHabit} className="flex gap-2.5 max-w-lg">
                        <Input
                            placeholder="Add a new habit routine (e.g. 90m Deep Work, Gym)..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            required
                            className="h-9 text-xs bg-card border-border/80 focus-visible:ring-1 focus-visible:ring-emerald-500"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!newHabitName.trim() || isSubmitting}
                            className="btn-tactile h-9 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 shrink-0">
                            <Plus className="size-3.5 mr-1" />
                            Add Habit
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
