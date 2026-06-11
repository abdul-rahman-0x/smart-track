"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate: Date | null;
    priority: string;
}

interface CalendarClientProps {
    initialTasks: Task[];
}

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarClient({ initialTasks }: CalendarClientProps) {
    const router = useRouter();
    const [currentYear, setCurrentYear] = useState(2026);

    // Compute tasks completion statistics by date string "YYYY-MM-DD"
    const activityMap = useMemo(() => {
        const map: Record<string, { total: number; completed: number }> = {};

        initialTasks.forEach((task) => {
            if (!task.dueDate) return;

            const dateKey = new Date(task.dueDate).toISOString().split("T")[0];

            if (!map[dateKey]) {
                map[dateKey] = { total: 0, completed: 0 };
            }

            map[dateKey].total += 1;
            if (task.completed) {
                map[dateKey].completed += 1;
            }
        });

        return map;
    }, [initialTasks]);

    const getMonthDays = (year: number, monthIndex: number) => {
        const firstDayIndex = new Date(year, monthIndex, 1).getDay();
        const totalDays = new Date(year, monthIndex + 1, 0).getDate();

        const daysArray: (number | null)[] = [];

        for (let i = 0; i < firstDayIndex; i++) {
            daysArray.push(null);
        }

        for (let day = 1; day <= totalDays; day++) {
            daysArray.push(day);
        }

        return daysArray;
    };

    const handleDateClick = (day: number, monthIndex: number) => {
        const formattedMonth = String(monthIndex + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        router.push(
            `/planner?date=${currentYear}-${formattedMonth}-${formattedDay}`,
        );
    };

    // Helper to determine the dynamic color class based on task completion
    const getDayColorClass = (day: number, monthIndex: number) => {
        const formattedMonth = String(monthIndex + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;

        const activity = activityMap[dateKey];

        if (!activity || activity.total === 0) {
            // Standard empty day - No borders or red coloring on empty Sundays
            return "text-stone-700 dark:text-stone-300 hover:bg-stone-900 hover:text-stone-50 dark:hover:bg-stone-50 dark:hover:text-stone-900";
        }

        const { total, completed } = activity;

        if (completed === 0) {
            // Tasks scheduled but none completed (Amber/Yellow warning badge)
            return "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:brightness-95";
        } else if (completed > 0 && completed < total) {
            // Partially completed tasks (Light Green progress badge)
            return "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800 hover:brightness-95";
        } else if (completed === total) {
            // All tasks completed (Solid GitHub-style Green badge)
            return "bg-emerald-600 text-emerald-50 border border-emerald-700 dark:bg-emerald-600 dark:text-emerald-50 dark:border-emerald-500 hover:bg-emerald-700";
        }

        return "";
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {currentYear} Year at a Glance
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400">
                        Select any colored date cell to navigate directly to
                        your daily schedule.
                    </p>
                </div>

                {/* Year Selector */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentYear((prev) => prev - 1)}
                        aria-label="Previous year">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold min-w-16 text-center">
                        {currentYear}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentYear((prev) => prev + 1)}
                        aria-label="Next year">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Structured SaaS-Grade Explanatory Key Card (Positioned at the TOP) */}
            <Card className="border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40 shadow-none rounded-2xl">
                <div className="p-6 space-y-4">
                    <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                        Understanding Your Consistency Tracker
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {/* Legend 1: No Tasks */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-white border border-stone-200 dark:bg-stone-950 dark:border-stone-800" />
                            <div className="text-xs">
                                <p className="font-bold text-stone-800 dark:text-stone-200">
                                    No Tasks Scheduled
                                </p>
                                <p className="text-stone-400">
                                    Rest day or unscheduled timeline.
                                </p>
                            </div>
                        </div>

                        {/* Legend 2: Amber Pending */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-amber-100 border border-amber-300 dark:bg-amber-950/40 dark:border-amber-800" />
                            <div className="text-xs">
                                <p className="font-bold text-stone-800 dark:text-stone-200">
                                    Tasks Pending
                                </p>
                                <p className="text-stone-400">
                                    Items scheduled but none completed.
                                </p>
                            </div>
                        </div>

                        {/* Legend 3: Light Green Partial */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800" />
                            <div className="text-xs">
                                <p className="font-bold text-stone-800 dark:text-stone-200">
                                    Partially Completed
                                </p>
                                <p className="text-stone-400">
                                    Some tasks are checked off.
                                </p>
                            </div>
                        </div>

                        {/* Legend 4: Deep Green Complete */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-emerald-600 border border-emerald-700 dark:bg-emerald-600 dark:border-emerald-500" />
                            <div className="text-xs">
                                <p className="font-bold text-stone-800 dark:text-stone-200">
                                    All Completed
                                </p>
                                <p className="text-stone-400">
                                    Total completion victory for the day.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 12-Month Calendar Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {MONTHS.map((monthName, monthIndex) => {
                    const days = getMonthDays(currentYear, monthIndex);

                    return (
                        <Card
                            key={monthName}
                            className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                            <CardHeader className="pb-3 border-b border-stone-100 dark:border-stone-800">
                                <CardTitle className="text-md font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                                    {monthName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {/* Weekdays Headers - Sunday highlighted in Rose Red */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-400 dark:text-stone-500 mb-2">
                                    {WEEKDAYS.map((day, idx) => (
                                        <span
                                            key={idx}
                                            className={
                                                idx === 0
                                                    ? "text-rose-500 dark:text-rose-400 font-bold"
                                                    : ""
                                            }>
                                            {day}
                                        </span>
                                    ))}
                                </div>

                                {/* Days Cells */}
                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {days.map((day, dayIdx) => {
                                        if (day === null) {
                                            return (
                                                <span
                                                    key={`empty-${dayIdx}`}
                                                    className="h-7 w-7"
                                                />
                                            );
                                        }

                                        const colorClass = getDayColorClass(
                                            day,
                                            monthIndex,
                                        );

                                        return (
                                            <button
                                                key={`day-${day}`}
                                                onClick={() =>
                                                    handleDateClick(
                                                        day,
                                                        monthIndex,
                                                    )
                                                }
                                                className={`h-7 w-7 flex items-center justify-center rounded-md font-medium focus:outline-none ${colorClass}`}>
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
