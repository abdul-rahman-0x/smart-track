"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarClient({ initialTasks }: CalendarClientProps) {
    const router = useRouter();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // --- LOGIC: Compute stats and mapping ---
    const activityMap = useMemo(() => {
        const map: Record<string, { total: number; completed: number }> = {};
        initialTasks.forEach((task) => {
            if (!task.dueDate) return;
            const dateKey = new Date(task.dueDate).toISOString().split("T")[0];
            if (!map[dateKey]) map[dateKey] = { total: 0, completed: 0 };
            map[dateKey].total += 1;
            if (task.completed) map[dateKey].completed += 1;
        });
        return map;
    }, [initialTasks]);

    const totalCompleted = useMemo(() => initialTasks.filter(t => t.completed).length, [initialTasks]);

    const getMonthDays = (year: number, monthIndex: number) => {
        const firstDayIndex = new Date(year, monthIndex, 1).getDay();
        const totalDays = new Date(year, monthIndex + 1, 0).getDate();
        const daysArray: (number | null)[] = [];
        for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
        for (let day = 1; day <= totalDays; day++) daysArray.push(day);
        return daysArray;
    };

    const handleDateClick = (day: number, monthIndex: number) => {
        const formattedMonth = String(monthIndex + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        router.push(`/planner?date=${currentYear}-${formattedMonth}-${formattedDay}`);
    };

    // --- UI HELPERS: Tier-based coloring ---
    const getDayStyles = (day: number, monthIndex: number) => {
        const formattedMonth = String(monthIndex + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
        const activity = activityMap[dateKey];

        if (!activity || activity.total === 0) {
            return "text-stone-400 dark:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800";
        }

        const { total, completed } = activity;

        if (completed === 0) {
            return "bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-[inset_0_0_8px_rgba(245,158,11,0.1)]";
        } else if (completed < total) {
            return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
        } else {
            return "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border-emerald-700";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 px-4 md:px-0">

            {/* --- HEADER --- */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-stone-100 dark:border-stone-800 pb-10">

                <h3 className="text-5xl font-serif font-medium text-stone-900 dark:text-white leading-none tracking-tight">
                    The {currentYear} Timeline
                </h3>

                <div className="flex items-center gap-4 bg-white dark:bg-stone-900 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">

                    {/* Metric Section */}
                    <div className="flex items-center gap-4 px-4 border-r border-stone-100 dark:border-stone-800">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Total Completed</p>
                            <p className="text-lg font-serif font-bold text-stone-900 dark:text-stone-50">{totalCompleted}</p>
                        </div>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex items-center gap-2 pr-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            onClick={() => setCurrentYear(prev => prev - 1)}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <span className="text-sm font-bold w-12 text-center select-none tabular-nums">
                            {currentYear}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            onClick={() => setCurrentYear(prev => prev + 1)}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- PROGRESS KEY --- */}
            <div className="flex flex-wrap gap-8 items-center justify-start text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm border border-stone-200 dark:border-stone-800" />
                    <span>Unscheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm bg-amber-500/20 border border-amber-500/30" />
                    <span>Pending Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
                    <span>Partial</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-sm bg-emerald-600 shadow-sm shadow-emerald-500/20" />
                    <span>All Victories</span>
                </div>
            </div>

            {/* --- GRID: 12-Month --- */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {MONTHS.map((monthName, monthIndex) => (
                    <Card key={monthName} className="border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-900/40 ring-1 ring-black/5 dark:ring-white/5 transition-all shadow-md">
                        <CardHeader className="pb-3 border-b border-stone-50 dark:border-stone-800/50">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">
                                {monthName}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-stone-300 dark:text-stone-700 mb-3">
                                {WEEKDAYS.map((day, idx) => (
                                    <span key={idx} className={idx === 0 ? "text-rose-400/60" : ""}>{day}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                {getMonthDays(currentYear, monthIndex).map((day, dayIdx) => {
                                    if (day === null) return <span key={`empty-${dayIdx}`} className="h-7 w-7" />;
                                    return (
                                        <button
                                            key={`day-${day}`}
                                            onClick={() => handleDateClick(day, monthIndex)}
                                            className={cn(
                                                "h-7 w-7 flex items-center justify-center rounded-md font-bold",
                                                getDayStyles(day, monthIndex)
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}