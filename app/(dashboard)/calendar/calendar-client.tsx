"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as  CheckCircle2, RotateCcw } from "lucide-react";
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

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarClient({ initialTasks }: CalendarClientProps) {
    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const actualCurrentYear = today.getFullYear();
    const actualCurrentMonth = today.getMonth();
    const actualCurrentDay = today.getDate();

    const [currentYear, setCurrentYear] = useState(actualCurrentYear);

    // --- Compute daily activity mapping ---
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

    const totalCompleted = useMemo(
        () => initialTasks.filter((t) => t.completed).length,
        [initialTasks]
    );

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

    // --- Activity styling & Tooltips ---
    const getDayInfo = (day: number, monthIndex: number) => {
        const formattedMonth = String(monthIndex + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        const dateKey = `${currentYear}-${formattedMonth}-${formattedDay}`;
        const activity = activityMap[dateKey];
        const isToday =
            currentYear === actualCurrentYear &&
            monthIndex === actualCurrentMonth &&
            day === actualCurrentDay;

        if (!activity || activity.total === 0) {
            return {
                style: isToday
                    ? "bg-secondary text-foreground font-bold ring-2 ring-emerald-500/70"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/70",
                tooltip: `${MONTHS[monthIndex]} ${day}, ${currentYear}: No tasks scheduled`,
                isToday,
            };
        }

        const { total, completed } = activity;

        let style = "";
        if (completed === 0) {
            style = "bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/25";
        } else if (completed < total) {
            style = "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/25";
        } else {
            style = "bg-emerald-600 text-white font-semibold shadow-xs shadow-emerald-500/20 hover:bg-emerald-500";
        }

        if (isToday) {
            style += " ring-2 ring-foreground";
        }

        return {
            style,
            tooltip: `${MONTHS[monthIndex]} ${day}, ${currentYear}: ${completed} of ${total} tasks completed`,
            isToday,
        };
    };

    return (
        <div className="relative space-y-8 pb-16">
            {/* Ambient subtle glow for background depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/[0.03] blur-3xl pointer-events-none rounded-full" />

            {/* --- HEADER --- */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                            {currentYear} Consistency Timeline
                        </h1>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/60">
                            Year Overview
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Visualize daily execution velocity and historical momentum.
                    </p>
                </div>

                {/* Right Controls: Stats & Year Nav */}
                <div className="flex items-center gap-3">
                    {/* Total completed metric badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/80 card-elevation">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span className="text-xs text-muted-foreground font-medium">Victories:</span>
                        <span className="text-sm font-bold text-foreground tabular-nums">
                            {totalCompleted}
                        </span>
                    </div>

                    {/* Jump to Today button */}
                    {currentYear !== actualCurrentYear && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8.5 text-xs border-border hover:bg-secondary"
                            onClick={() => setCurrentYear(actualCurrentYear)}>
                            <RotateCcw className="size-3 mr-1" />
                            Today
                        </Button>
                    )}

                    {/* Year Navigation Bar */}
                    <div className="flex items-center bg-card border border-border/80 rounded-lg p-0.5 card-elevation">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Previous year"
                            className="size-7.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setCurrentYear((prev) => prev - 1)}>
                            <ChevronLeft className="size-4" />
                        </Button>

                        <span className="text-xs font-semibold px-2.5 text-foreground select-none tabular-nums">
                            {currentYear}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Next year"
                            className="size-7.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setCurrentYear((prev) => prev + 1)}>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- PROGRESS KEY / LEGEND --- */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground px-1">
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-xs border border-border/80 bg-secondary/60" />
                    <span>Unscheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-xs bg-amber-500/20 border border-amber-500/40" />
                    <span>Pending Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-xs bg-emerald-500/20 border border-emerald-500/40" />
                    <span>Partial Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-xs bg-emerald-600 shadow-xs shadow-emerald-500/30" />
                    <span className="font-medium text-foreground">All Victories</span>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                    <div className="size-2.5 rounded-xs ring-2 ring-emerald-500/70 bg-secondary" />
                    <span className="text-muted-foreground">Today</span>
                </div>
            </div>

            {/* --- 12-MONTH CALENDAR MATRIX --- */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {MONTHS.map((monthName, monthIndex) => {
                    const isCurrentMonth =
                        currentYear === actualCurrentYear &&
                        monthIndex === actualCurrentMonth;

                    return (
                        <div
                            key={monthName}
                            className={cn(
                                "rounded-xl border bg-card p-4 card-elevation transition-all",
                                isCurrentMonth
                                    ? "border-emerald-500/30 shadow-xs shadow-emerald-500/5"
                                    : "border-border/80 hover:border-border"
                            )}>
                            {/* Month Header */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {monthName}
                                </span>
                                {isCurrentMonth && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        Current
                                    </span>
                                )}
                            </div>

                            {/* Weekday Row */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground/60 mb-2">
                                {WEEKDAYS.map((day, idx) => (
                                    <span key={idx} className={idx === 0 || idx === 6 ? "opacity-60" : ""}>
                                        {day}
                                    </span>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                {getMonthDays(currentYear, monthIndex).map((day, dayIdx) => {
                                    if (day === null) {
                                        return <div key={`empty-${dayIdx}`} className="h-7 w-7" />;
                                    }

                                    const { style, tooltip } = getDayInfo(day, monthIndex);

                                    return (
                                        <button
                                            key={`day-${day}`}
                                            type="button"
                                            title={tooltip}
                                            onClick={() => handleDateClick(day, monthIndex)}
                                            className={cn(
                                                "h-7 w-7 flex items-center justify-center rounded-md font-medium text-xs transition-all relative focus:outline-hidden",
                                                style
                                            )}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
