"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate: Date | string | null;
    priority: string;
}

interface CalendarClientProps {
    initialTasks: Task[];
}

interface DayActivity {
    total: number;
    completed: number;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
] as const;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

// Safe local YYYY-MM-DD parsing (prevents UTC date shift)
function toLocalDateKey(dateInput: Date | string): string {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function CalendarClient({ initialTasks }: CalendarClientProps) {
    const router = useRouter();

    const today = useMemo(() => new Date(), []);
    const actualYear = today.getFullYear();
    const actualMonth = today.getMonth();
    const actualDay = today.getDate();

    const [currentYear, setCurrentYear] = useState<number>(actualYear);

    // Group tasks by local date key
    const activityMap = useMemo(() => {
        const map: Record<string, DayActivity> = {};
        for (const task of initialTasks) {
            if (!task.dueDate) continue;
            const key = toLocalDateKey(task.dueDate);
            if (!map[key]) {
                map[key] = { total: 0, completed: 0 };
            }
            map[key].total += 1;
            if (task.completed) {
                map[key].completed += 1;
            }
        }
        return map;
    }, [initialTasks]);

    // Year overview metrics
    const yearStats = useMemo(() => {
        let tasksInYear = 0;
        let completedInYear = 0;
        let perfectDays = 0;
        let daysWithTasks = 0;

        for (const [dateKey, activity] of Object.entries(activityMap)) {
            if (dateKey.startsWith(`${currentYear}-`)) {
                tasksInYear += activity.total;
                completedInYear += activity.completed;
                if (activity.total > 0) {
                    daysWithTasks += 1;
                    if (activity.completed === activity.total) {
                        perfectDays += 1;
                    }
                }
            }
        }

        const rate = tasksInYear > 0 ? Math.round((completedInYear / tasksInYear) * 100) : 0;
        return { tasksInYear, completedInYear, perfectDays, daysWithTasks, rate };
    }, [activityMap, currentYear]);

    const handleDateClick = (day: number, monthIndex: number) => {
        const mm = String(monthIndex + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        router.push(`/planner?date=${currentYear}-${mm}-${dd}`);
    };

    return (
        <div className="space-y-8 pb-16 selection:bg-[#F9F8F6]/20">
            {/* Header & Year Controls */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            {currentYear} Activity Calendar
                        </h1>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9F8F6]/60 bg-[#161616] px-2 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08]">
                            YEAR OVERVIEW
                        </span>
                    </div>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        Click on any day to open and review your scheduled tasks in the planner.
                    </p>
                </div>

                {/* Year Navigator */}
                <div className="flex flex-wrap items-center gap-3">
                    {currentYear !== actualYear && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentYear(actualYear)}
                            className="text-xs font-sans h-8 border-[#F9F8F6]/[0.12] text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <RotateCcw className="size-3 mr-1.5" />
                            Jump to This Year
                        </Button>
                    )}

                    <div className="flex items-center bg-[#161616] border border-[#F9F8F6]/[0.08] rounded-[8px] p-0.5">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Previous year"
                            className="size-7 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                            onClick={() => setCurrentYear((prev) => prev - 1)}
                        >
                            <ChevronLeft className="size-3.5" />
                        </Button>

                        <span className="text-xs font-mono font-medium px-3 text-[#F9F8F6] tabular-nums select-none">
                            {currentYear}
                        </span>

                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Next year"
                            className="size-7 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                            onClick={() => setCurrentYear((prev) => prev + 1)}
                        >
                            <ChevronRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Clear Macro Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SummaryMetric
                    label="Completion Rate"
                    value={`${yearStats.rate}%`}
                    detail={`${yearStats.completedInYear} of ${yearStats.tasksInYear} tasks finished`}
                    highlight={yearStats.rate >= 80}
                />
                <SummaryMetric
                    label="Perfect Days"
                    value={yearStats.perfectDays.toString()}
                    detail="100% of tasks finished"
                    highlight={yearStats.perfectDays > 0}
                />
                <SummaryMetric
                    label="Total Tasks"
                    value={yearStats.tasksInYear.toString()}
                    detail={`Scheduled across ${currentYear}`}
                />
                <SummaryMetric
                    label="Active Days"
                    value={yearStats.daysWithTasks.toString()}
                    detail="Days with planned tasks"
                />
            </div>

            {/* Progress Scale Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-1 text-xs text-[#F9F8F6]/60 border-b border-[#F9F8F6]/[0.04]">
                <div className="flex flex-wrap items-center gap-5">
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-[3px] bg-[#161616] border border-[#F9F8F6]/[0.08]" />
                        <span className="text-xs font-sans">No tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-[3px] bg-[#FBBF24]/20 border border-[#FBBF24]/40" />
                        <span className="text-xs font-sans">In progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-[3px] bg-[#66CC63]/25 border border-[#66CC63]/40" />
                        <span className="text-xs font-sans">Partial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-[3px] bg-[#66CC63]" />
                        <span className="text-xs font-sans text-[#F9F8F6] font-medium">All completed</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-[3px] border border-[#F9F8F6] bg-[#20201F]" />
                    <span className="text-xs font-sans text-[#F9F8F6]">Today</span>
                </div>
            </div>

            {/* 12-Month Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {MONTHS.map((monthName, monthIndex) => {
                    const isCurrentMonth =
                        currentYear === actualYear && monthIndex === actualMonth;

                    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
                    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();

                    return (
                        <div
                            key={monthName}
                            className={cn(
                                "rounded-[16px] border bg-[#161616] p-4 flex flex-col justify-between transition-colors",
                                isCurrentMonth
                                    ? "border-[#F9F8F6]/25 shadow-md"
                                    : "border-[#F9F8F6]/[0.08] hover:border-[#F9F8F6]/15"
                            )}
                        >
                            {/* Month Header */}
                            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F9F8F6]/[0.06]">
                                <span className="text-xs font-sans font-medium text-[#F9F8F6]">
                                    {monthName}
                                </span>
                                {isCurrentMonth && (
                                    <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[#F9F8F6]/10 text-[#F9F8F6] border border-[#F9F8F6]/20">
                                        Current
                                    </span>
                                )}
                            </div>

                            {/* Weekday Row */}
                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-[#F9F8F6]/40 mb-1.5">
                                {WEEKDAYS.map((day, idx) => (
                                    <span key={idx}>{day}</span>
                                ))}
                            </div>

                            {/* Month Day Cells */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="size-7" />
                                ))}

                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const mm = String(monthIndex + 1).padStart(2, "0");
                                    const dd = String(day).padStart(2, "0");
                                    const dateKey = `${currentYear}-${mm}-${dd}`;
                                    const activity = activityMap[dateKey];

                                    const isToday =
                                        currentYear === actualYear &&
                                        monthIndex === actualMonth &&
                                        day === actualDay;

                                    const hasActivity = activity && activity.total > 0;
                                    const isComplete = hasActivity && activity.completed === activity.total;
                                    const isPartial =
                                        hasActivity && activity.completed > 0 && activity.completed < activity.total;
                                    const isPending = hasActivity && activity.completed === 0;

                                    return (
                                        <button
                                            key={`day-${day}`}
                                            type="button"
                                            onClick={() => handleDateClick(day, monthIndex)}
                                            className={cn(
                                                "size-7 flex items-center justify-center rounded-[6px] text-xs font-mono transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#F9F8F6]",
                                                // Base / Empty state
                                                !hasActivity &&
                                                "text-[#F9F8F6]/40 hover:bg-[#20201F] hover:text-[#F9F8F6]",
                                                // Task state styles
                                                isComplete &&
                                                "bg-[#66CC63] text-[#0E0D0C] font-semibold hover:bg-[#7be678]",
                                                isPartial &&
                                                "bg-[#66CC63]/20 text-[#66CC63] border border-[#66CC63]/40 hover:bg-[#66CC63]/30",
                                                isPending &&
                                                "bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 hover:bg-[#FBBF24]/25",
                                                // Today highlight border
                                                isToday &&
                                                "ring-1 ring-[#F9F8F6] ring-offset-1 ring-offset-[#161616] font-bold"
                                            )}
                                            aria-label={`${monthName} ${day}, ${currentYear}${hasActivity
                                                    ? `: ${activity.completed} of ${activity.total} completed`
                                                    : ": No tasks"
                                                }`}
                                        >
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

function SummaryMetric({
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
        <div className="rounded-[12px] bg-[#161616] border border-[#F9F8F6]/[0.08] p-4 space-y-1">
            <span className="text-xs font-sans text-[#F9F8F6]/60 block">{label}</span>
            <div className="flex items-baseline gap-1.5">
                <span
                    className={cn(
                        "text-2xl font-mono font-medium tracking-tight",
                        highlight ? "text-[#66CC63]" : "text-[#F9F8F6]"
                    )}
                >
                    {value}
                </span>
            </div>
            <span className="text-xs font-sans text-[#F9F8F6]/40 block truncate">
                {detail}
            </span>
        </div>
    );
}
