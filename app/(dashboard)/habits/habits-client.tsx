"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
    Trash,
    Plus,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
} from "lucide-react";

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

    const selectedDate = new Date(selectedDateStr);

    const currentDayOfWeek = selectedDate.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + distanceToMonday);

    const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        return day;
    });

    const weekRangeLabel = `Week of ${monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })} - ${WEEK_DAYS[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    const handleNavigate = (direction: "prev" | "next") => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(
            selectedDate.getDate() + (direction === "next" ? 7 : -7),
        );
        router.push(`/habits?date=${nextDate.toISOString().split("T")[0]}`);
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;
        const name = newHabitName;
        setNewHabitName("");
        await createHabit(name);
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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Controller */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Habit Tracker
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400">
                        Build routines that lead to success. Toggle completions
                        across your weekly grid.
                    </p>
                </div>

                {/* Weekly Navigation Controls & Reset Button */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigate("prev")}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold min-w-36 text-center">
                        {weekRangeLabel}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNavigate("next")}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleResetWeek}
                        className="hover:text-red-500"
                        title="Reset this week's progress">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Habits Grid Workspace Container */}
            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none overflow-hidden rounded-2xl">
                {/* Symmetric Custom Header (Visible on Desktop only to prevent mobile crowding) */}
                <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 bg-stone-50/50 dark:bg-stone-950/20 border-b border-stone-100 dark:border-stone-800 text-xs font-semibold text-stone-400">
                    <div className="col-span-3">Habit Routine</div>
                    <div className="col-span-5 grid grid-cols-7 gap-2 text-center">
                        {WEEK_DAYS.map((day) => (
                            <div
                                key={day.toDateString()}
                                className="space-y-0.5">
                                <span className="block uppercase tracking-wider text-[10px] text-stone-400">
                                    {day.toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })}
                                </span>
                                <span className="text-xs font-semibold text-stone-500">
                                    {day.toLocaleDateString("en-US", {
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="col-span-2 text-right">Weekly Progress</div>
                </div>

                {/* Habits Rows */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                    {initialHabits.length > 0 ? (
                        initialHabits.map((habit) => {
                            const habitWeekCompletions =
                                initialCompletions.filter(
                                    (c) => c.habitId === habit.id,
                                );
                            const completionCount = habitWeekCompletions.length;

                            return (
                                <div
                                    key={habit.id}
                                    className="grid grid-cols-1 md:grid-cols-10 gap-4 items-center p-6 hover:bg-stone-50/40 dark:hover:bg-stone-950/10">
                                    {/* Column 1 (col-span-3): Habit Details & Actions */}
                                    <div className="col-span-1 md:col-span-3 flex items-center justify-between gap-4 group">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-stone-800 dark:text-stone-100">
                                                {habit.name}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                                                <Flame className="w-3.5 h-3.5 fill-current" />
                                                <span>
                                                    {habit.streak}d streak
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                await deleteHabit(habit.id);
                                            }}
                                            className="text-stone-400 hover:text-red-500 md:opacity-0 group-hover:opacity-100 focus:outline-none"
                                            title="Delete habit">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Column 2 (col-span-5): 7-Day Checklist Buttons */}
                                    <div className="col-span-1 md:col-span-5 grid grid-cols-7 gap-2 text-center">
                                        {WEEK_DAYS.map((day) => {
                                            const dateKey = day
                                                .toISOString()
                                                .split("T")[0];
                                            const isCompleted =
                                                habitWeekCompletions.some(
                                                    (c) =>
                                                        new Date(
                                                            c.completedAt,
                                                        ).toDateString() ===
                                                        day.toDateString(),
                                                );

                                            return (
                                                <div
                                                    key={dateKey}
                                                    className="flex flex-col items-center justify-center gap-1">
                                                    {/* Mini Day Header (Visible on Mobile to track alignments) */}
                                                    <span className="block md:hidden text-[9px] uppercase tracking-wider text-stone-400">
                                                        {day.toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                weekday:
                                                                    "narrow",
                                                            },
                                                        )}
                                                    </span>
                                                    <button
                                                        onClick={async () => {
                                                            await toggleHabitDate(
                                                                habit.id,
                                                                dateKey,
                                                            );
                                                        }}
                                                        className={`w-7 h-7 rounded-lg border flex items-center justify-center focus:outline-none ${
                                                            isCompleted
                                                                ? "bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700"
                                                                : "bg-white border-stone-200 dark:bg-stone-950 dark:border-stone-800 hover:bg-stone-50"
                                                        }`}>
                                                        {isCompleted && (
                                                            <Check className="w-4 h-4 stroke-[3]" />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Column 3 (col-span-2): Premium Progress Indicator */}
                                    <div className="col-span-1 md:col-span-2 text-left md:text-right">
                                        <span className="inline-block text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full">
                                            {completionCount} of 7 Completed
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-stone-400">
                            No habits logged yet. Create your first routine
                            below!
                        </div>
                    )}
                </div>

                {/* Bottom Form */}
                <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-950/10">
                    <form
                        onSubmit={handleAddHabit}
                        className="flex gap-3 max-w-xl">
                        <Input
                            name="name"
                            placeholder="Add a new habit routine..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            required
                            className="h-9 text-sm bg-white dark:bg-stone-950"
                        />
                        <Button type="submit" size="sm" className="flex gap-2">
                            <Plus className="w-4 h-4" /> Add Habit
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
