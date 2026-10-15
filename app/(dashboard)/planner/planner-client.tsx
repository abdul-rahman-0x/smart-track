"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    Trash2,
    Calendar as CalendarIcon,
    Target,
    Zap,
    Plus,
    Check,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    GraduationCap,
    Clock,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createPlannerTask, toggleTask, deleteTask } from "./actions";
import { toast } from "sonner";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    dueDate: Date | null;
}

interface Exam {
    id: string;
    subject: string;
}

interface PlannerClientProps {
    initialTasks: Task[];
    exams: Exam[];
    isPro: boolean;
    selectedDateStr: string;
}

export function PlannerClient({
    initialTasks,
    exams,
    isPro,
    selectedDateStr,
}: PlannerClientProps) {
    const router = useRouter();
    const [taskTitle, setTaskTitle] = useState("");
    const [priority, setPriority] = useState<"high" | "medium">("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);

    // --- Date Parsing & Day Switcher Logic ---
    const dateObj = useMemo(() => {
        if (!selectedDateStr) return new Date();
        const [year, month, day] = selectedDateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
    }, [selectedDateStr]);

    const isToday = useMemo(() => {
        const now = new Date();
        return (
            now.getFullYear() === dateObj.getFullYear() &&
            now.getMonth() === dateObj.getMonth() &&
            now.getDate() === dateObj.getDate()
        );
    }, [dateObj]);

    const navigateDay = (offset: number) => {
        const next = new Date(dateObj);
        next.setDate(next.getDate() + offset);
        const y = next.getFullYear();
        const m = String(next.getMonth() + 1).padStart(2, "0");
        const d = String(next.getDate()).padStart(2, "0");
        router.push(`/planner?date=${y}-${m}-${d}`);
    };

    const jumpToToday = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        router.push(`/planner?date=${y}-${m}-${d}`);
    };

    // --- Task Categorization ---
    const activeTasks = initialTasks.filter((t) => !t.completed);
    const completedTasks = initialTasks.filter((t) => t.completed);
    const highPriorityTasks = activeTasks.filter((t) => t.priority === "high");
    const normalTasks = activeTasks.filter((t) => t.priority !== "high");

    const onAdd = async () => {
        if (!taskTitle.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await createPlannerTask({
                title: taskTitle.trim(),
                priority,
                dueDateStr: selectedDateStr,
            });
            setTaskTitle("");
            toast.success("Task added to queue");
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PRO_LIMIT_REACHED"
            ) {
                toast.error("Upgrade to Pro for unlimited daily tasks.");
            } else {
                toast.error("Failed to create task.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative space-y-8 pb-16 max-w-4xl mx-auto">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-56 bg-emerald-500/[0.03] blur-3xl pointer-events-none rounded-full" />

            {/* --- HEADER: Date Navigation & Tier Quota --- */}
            <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                            Smart Planner
                        </h1>
                        {isToday && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                Today
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {format(dateObj, "EEEE, MMMM do, yyyy")}
                    </p>
                </div>

                {/* Day Switcher Controls */}
                <div className="flex items-center gap-2.5">
                    {!isToday && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={jumpToToday}
                            className="h-8.5 text-xs border-border hover:bg-secondary">
                            <RotateCcw className="size-3 mr-1.5" />
                            Today
                        </Button>
                    )}

                    <div className="flex items-center bg-card border border-border/80 rounded-lg p-0.5 card-elevation">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Previous Day"
                            onClick={() => navigateDay(-1)}
                            className="size-7.5 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="text-xs font-semibold px-2 text-foreground select-none">
                            {format(dateObj, "MMM d")}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Next Day"
                            onClick={() => navigateDay(1)}
                            className="size-7.5 text-muted-foreground hover:text-foreground">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    {/* Tier Quota */}
                    {!isPro ? (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/80 card-elevation text-xs">
                            <span className="text-muted-foreground font-medium">Free:</span>
                            <span className="font-bold text-foreground">
                                {initialTasks.length}/10
                            </span>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                            <Sparkles className="size-3" />
                            <span>Pro Unlimited</span>
                        </div>
                    )}
                </div>
            </header>

            {/* --- EXAM NOTICE (If exam matches this date) --- */}
            {exams && exams.length > 0 && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-4 flex items-center justify-between gap-3 card-elevation">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                            <GraduationCap className="size-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                                Exam Target Date
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                                {exams.map((e) => e.subject).join(", ")}
                            </span>
                        </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                        Schedule preparation blocks below
                    </span>
                </div>
            )}

            {/* --- COMMAND INPUT BAR --- */}
            <div className="rounded-xl border border-border/90 bg-card p-2 sm:p-2.5 card-elevation">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0 ml-1">
                        <Zap className="size-4 text-emerald-500" />
                    </div>
                    <Input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onAdd()}
                        placeholder="Add a new task or time-block..."
                        className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60 px-2"
                    />

                    {/* Priority Selector Pills */}
                    <div className="flex items-center gap-1.5 shrink-0 pr-1">
                        <button
                            type="button"
                            onClick={() =>
                                setPriority(priority === "high" ? "medium" : "high")
                            }
                            className={cn(
                                "h-8 px-2.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1",
                                priority === "high"
                                    ? "bg-amber-500/15 border-amber-500/30 text-amber-500 font-semibold"
                                    : "bg-secondary/60 border-border/60 text-muted-foreground hover:text-foreground",
                            )}>
                            <Target className="size-3" />
                            <span>Focus</span>
                        </button>

                        <Button
                            onClick={onAdd}
                            size="sm"
                            disabled={!taskTitle.trim() || isSubmitting}
                            className="btn-tactile h-8 px-3 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 shrink-0">
                            <Plus className="size-3.5 mr-1" />
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- TASK LIST CONTAINER --- */}
            <div className="space-y-6">
                {/* 1. Critical Focus Section (High Priority) */}
                {highPriorityTasks.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.02] p-5 card-elevation space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                            <div className="flex items-center gap-2 text-amber-500">
                                <Target className="size-4" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">
                                    Critical Focus
                                </h2>
                            </div>
                            <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                                High Priority
                            </span>
                        </div>
                        <div className="space-y-1 divide-y divide-border/40">
                            {highPriorityTasks.map((task) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Daily Log Section (Normal Priority) */}
                <div className="rounded-xl border border-border/90 bg-card p-5 card-elevation space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="size-4" />
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                Daily Tasks ({normalTasks.length})
                            </h2>
                        </div>
                    </div>

                    {normalTasks.length > 0 ? (
                        <div className="space-y-1 divide-y divide-border/40">
                            {normalTasks.map((task) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-xs text-muted-foreground">
                                No standard tasks scheduled for this day.
                            </p>
                        </div>
                    )}
                </div>

                {/* 3. Completed Section (Collapsible) */}
                {completedTasks.length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-emerald-500" />
                                <span>Completed ({completedTasks.length})</span>
                            </div>
                            <span className="text-[10px] underline">
                                {showCompleted ? "Hide" : "Show"}
                            </span>
                        </button>

                        {showCompleted && (
                            <div className="space-y-1 divide-y divide-border/30 pt-2 border-t border-border/30">
                                {completedTasks.map((task) => (
                                    <TaskRow key={task.id} task={task} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Individual Task Row Component ---
function TaskRow({ task }: { task: Task }) {
    const isHourly = task.title.startsWith("[");
    const isExam = task.title.includes("EXAM:");

    return (
        <div className="group flex items-center justify-between py-2.5 px-1 hover:bg-secondary/40 rounded-lg transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Tactile Checkbox */}
                <button
                    type="button"
                    onClick={() => toggleTask(task.id, !task.completed)}
                    className={cn(
                        "size-5 rounded-md border flex items-center justify-center transition-all shrink-0",
                        task.completed
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                            : "border-border/80 bg-card hover:border-emerald-500/60",
                    )}>
                    {task.completed && <Check className="size-3 stroke-[2.5]" />}
                </button>

                {/* Task Details */}
                <div className="flex flex-col min-w-0 pr-3">
                    <span
                        className={cn(
                            "text-sm font-medium truncate transition-all",
                            task.completed
                                ? "text-muted-foreground line-through decoration-muted-foreground/40"
                                : "text-foreground",
                        )}>
                        {task.title.replace(/\[.*?\]/g, "").trim()}
                    </span>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 mt-0.5">
                        {isHourly && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                <Clock className="size-2.5" />
                                Time Block
                            </span>
                        )}
                        {isExam && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                                <GraduationCap className="size-2.5" />
                                Exam Target
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Trash Action */}
            <Button
                variant="ghost"
                size="icon"
                aria-label="Delete task"
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0">
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    );
}
