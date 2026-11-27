"use client";

import React, { useState, useMemo, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, isValid } from "date-fns";
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
    ChevronDown,
    ArrowUpRight,
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

type OptimisticAction =
    | { type: "TOGGLE"; id: string; completed: boolean }
    | { type: "DELETE"; id: string }
    | { type: "ADD"; task: Task };

const MAX_FREE_TASKS = 10;

// Safe date parsing to prevent client runtime exceptions on malformed parameters
function parseSelectedDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split("-").map(Number);
    const parsed = new Date(year, (month || 1) - 1, day || 1);
    return isValid(parsed) ? parsed : new Date();
}

export function PlannerClient({
    initialTasks,
    exams,
    isPro,
    selectedDateStr,
}: PlannerClientProps) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const [taskTitle, setTaskTitle] = useState("");
    const [priority, setPriority] = useState<"high" | "medium">("medium");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);

    // Optimistic UI state buffer
    const [optimisticTasks, setOptimisticTasks] = useOptimistic(
        initialTasks,
        (state: Task[], action: OptimisticAction) => {
            switch (action.type) {
                case "TOGGLE":
                    return state.map((t) =>
                        t.id === action.id ? { ...t, completed: action.completed } : t
                    );
                case "DELETE":
                    return state.filter((t) => t.id !== action.id);
                case "ADD":
                    return [action.task, ...state];
                default:
                    return state;
            }
        }
    );

    const dateObj = useMemo(() => parseSelectedDate(selectedDateStr), [selectedDateStr]);

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

    // Quota metrics for conversion gating
    const currentTaskCount = optimisticTasks.length;
    const isAtLimit = !isPro && currentTaskCount >= MAX_FREE_TASKS;
    const isNearLimit = !isPro && currentTaskCount >= MAX_FREE_TASKS - 2;

    // Task sorting
    const activeTasks = optimisticTasks.filter((t) => !t.completed);
    const completedTasks = optimisticTasks.filter((t) => t.completed);
    const highPriorityTasks = activeTasks.filter((t) => t.priority === "high");
    const normalTasks = activeTasks.filter((t) => t.priority !== "high");

    // Actions with rollbacks
    const handleToggle = (id: string, nextCompleted: boolean) => {
        startTransition(async () => {
            setOptimisticTasks({ type: "TOGGLE", id, completed: nextCompleted });
            try {
                await toggleTask(id, nextCompleted);
            } catch {
                toast.error("Failed to sync task status. Reverting change.");
            }
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            setOptimisticTasks({ type: "DELETE", id });
            try {
                await deleteTask(id);
                toast.success("Task removed");
            } catch {
                toast.error("Failed to delete task. Reverting change.");
            }
        });
    };

    const onAdd = async () => {
        const cleanTitle = taskTitle.trim();
        if (!cleanTitle || isSubmitting) return;

        if (isAtLimit) {
            toast.error("Free quota reached. Upgrade to Pro for unlimited daily execution.");
            return;
        }

        setIsSubmitting(true);
        const tempId = `temp-${Date.now()}`;

        startTransition(async () => {
            setOptimisticTasks({
                type: "ADD",
                task: {
                    id: tempId,
                    title: cleanTitle,
                    priority,
                    completed: false,
                    dueDate: dateObj,
                },
            });

            setTaskTitle("");

            try {
                await createPlannerTask({
                    title: cleanTitle,
                    priority,
                    dueDateStr: selectedDateStr,
                });
                toast.success("Task committed to queue");
            } catch (error) {
                if (error instanceof Error && error.message === "PRO_LIMIT_REACHED") {
                    toast.error("Daily free quota exhausted. Upgrade for unlimited tasks.");
                } else {
                    toast.error("Could not write task to ledger.");
                }
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="relative space-y-8 pb-16 max-w-4xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header & Controls */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            Execution Planner
                        </h1>
                        {isToday && (
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#66CC63]/15 text-[#66CC63] border border-[#66CC63]/30">
                                Today
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        {format(dateObj, "EEEE, MMMM do, yyyy")}
                    </p>
                </div>

                {/* Navigation & Quota Indicator */}
                <div className="flex items-center gap-2.5">
                    {!isToday && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={jumpToToday}
                            className="h-8.5 text-xs font-mono border-[#F9F8F6]/[0.12] text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <RotateCcw className="size-3 mr-1.5" />
                            Today
                        </Button>
                    )}

                    <div className="flex items-center bg-[#161616] border border-[#F9F8F6]/[0.08] rounded-[8px] p-0.5">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Previous Day"
                            onClick={() => navigateDay(-1)}
                            className="size-7.5 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="text-xs font-mono font-medium px-2.5 text-[#F9F8F6] tabular-nums select-none">
                            {format(dateObj, "MMM d")}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Next Day"
                            onClick={() => navigateDay(1)}
                            className="size-7.5 rounded-[6px] text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    {/* Tier Status Badge */}
                    {isPro ? (
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#20201F] text-[#F9F8F6] text-xs font-mono border border-[#F9F8F6]/[0.12]">
                            <Sparkles className="size-3 text-[#66CC63]" />
                            <span>PRO UNLIMITED</span>
                        </div>
                    ) : (
                        <Link
                            href="/pricing"
                            className={cn(
                                "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-xs font-mono transition-colors",
                                isAtLimit
                                    ? "bg-[#B42318]/15 border-[#B42318]/40 text-[#F87171] hover:bg-[#B42318]/25"
                                    : isNearLimit
                                        ? "bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24]/20"
                                        : "bg-[#161616] border-[#F9F8F6]/[0.08] text-[#F9F8F6]/60 hover:border-[#F9F8F6]/20"
                            )}
                        >
                            <span>CAPACITY:</span>
                            <span className="font-bold text-[#F9F8F6]">{currentTaskCount}/{MAX_FREE_TASKS}</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Aggressive Pro Upsell Trigger (Rendered when approaching or hitting limit) */}
            {!isPro && (isNearLimit || isAtLimit) && (
                <div className="rounded-[16px] border border-[#F9F8F6]/[0.12] bg-[#161616] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30">
                                {isAtLimit ? "Capacity Reached" : "Quota Warning"}
                            </span>
                            <span className="text-xs font-medium text-[#F9F8F6]">
                                {currentTaskCount} of {MAX_FREE_TASKS} daily tasks allocated
                            </span>
                        </div>
                        <p className="text-xs text-[#F9F8F6]/60">
                            Free plans enforce a strict 10-task ceiling per calendar day. Upgrade to Pro for unmetered sprints.
                        </p>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        className="bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] font-sans font-medium text-xs h-8 px-3.5 rounded-[8px] shrink-0"
                    >
                        <Link href="/pricing" className="flex items-center gap-1">
                            Unlock Pro Plan
                            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                        </Link>
                    </Button>
                </div>
            )}

            {/* Exam Target Alert */}
            {exams && exams.length > 0 && (
                <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-[8px] bg-[#20201F] text-[#F87171] flex items-center justify-center shrink-0 border border-[#F9F8F6]/[0.08]">
                            <GraduationCap className="size-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#F87171] block">
                                Target Deadline Today
                            </span>
                            <span className="text-sm font-medium text-[#F9F8F6]">
                                {exams.map((e) => e.subject).join(", ")}
                            </span>
                        </div>
                    </div>
                    <span className="text-xs font-mono text-[#F9F8F6]/40 hidden sm:inline">
                        Priority Preparation Day
                    </span>
                </div>
            )}

            {/* Task Input Command Bar */}
            <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-2 sm:p-2.5 transition-colors focus-within:border-[#F9F8F6]/25">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-[8px] bg-[#20201F] flex items-center justify-center text-[#F9F8F6]/60 shrink-0 ml-1 border border-[#F9F8F6]/[0.06]">
                        <Zap className="size-4 text-[#F9F8F6]" />
                    </div>
                    <Input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onAdd()}
                        placeholder={
                            isAtLimit
                                ? "Daily limit reached. Upgrade to Pro to continue adding..."
                                : "Record commitment or sprint block..."
                        }
                        disabled={isAtLimit}
                        className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm text-[#F9F8F6] placeholder:text-[#F9F8F6]/40 px-2"
                    />

                    {/* Priority Toggle & Add Action */}
                    <div className="flex items-center gap-2 shrink-0 pr-1">
                        <button
                            type="button"
                            disabled={isAtLimit}
                            onClick={() => setPriority(priority === "high" ? "medium" : "high")}
                            className={cn(
                                "h-8 px-2.5 text-xs font-mono rounded-[8px] border transition-colors flex items-center gap-1.5",
                                priority === "high"
                                    ? "bg-[#FBBF24]/15 border-[#FBBF24]/40 text-[#FBBF24] font-medium"
                                    : "bg-[#20201F] border-[#F9F8F6]/[0.08] text-[#F9F8F6]/60 hover:text-[#F9F8F6]"
                            )}
                        >
                            <Target className="size-3" />
                            <span>{priority === "high" ? "HIGH" : "NORMAL"}</span>
                        </button>

                        <Button
                            onClick={onAdd}
                            size="sm"
                            disabled={!taskTitle.trim() || isSubmitting || isAtLimit}
                            className="bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] font-sans font-medium h-8 px-3.5 text-xs rounded-[8px] shrink-0 disabled:opacity-30"
                        >
                            <Plus className="size-3.5 mr-1 stroke-[2.5]" />
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            {/* Task Queue Groupings */}
            <div className="space-y-6">
                {/* Critical High-Priority Queue */}
                {highPriorityTasks.length > 0 && (
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.12] bg-[#161616] p-5 space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F9F8F6]/[0.06]">
                            <div className="flex items-center gap-2 text-[#FBBF24]">
                                <Target className="size-4" />
                                <h2 className="text-xs font-mono uppercase tracking-wider">
                                    Critical Focus Tasks
                                </h2>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20">
                                {highPriorityTasks.length} Active
                            </span>
                        </div>
                        <div className="space-y-1">
                            {highPriorityTasks.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Standard Task Queue */}
                <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F9F8F6]/[0.06]">
                        <div className="flex items-center gap-2 text-[#F9F8F6]/80">
                            <CalendarIcon className="size-4" />
                            <h2 className="text-xs font-mono uppercase tracking-wider text-[#F9F8F6]">
                                General Ledger ({normalTasks.length})
                            </h2>
                        </div>
                    </div>

                    {normalTasks.length > 0 ? (
                        <div className="space-y-1">
                            {normalTasks.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-1">
                            <p className="text-sm font-sans text-[#F9F8F6]/60">
                                No active commitments recorded for this day.
                            </p>
                            <p className="text-xs font-mono text-[#F9F8F6]/30">
                                Use the command bar above to schedule a block.
                            </p>
                        </div>
                    )}
                </div>

                {/* Completed Archive */}
                {completedTasks.length > 0 && (
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.06] bg-[#161616]/60 p-4 space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="w-full flex items-center justify-between text-xs font-mono text-[#F9F8F6]/60 hover:text-[#F9F8F6] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-[#66CC63]" />
                                <span>RESOLVED COMMITMENTS ({completedTasks.length})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                                <span>{showCompleted ? "COLLAPSE" : "EXPAND"}</span>
                                <ChevronDown
                                    className={cn(
                                        "size-3.5 transition-transform duration-200",
                                        showCompleted ? "rotate-180" : ""
                                    )}
                                />
                            </div>
                        </button>

                        {showCompleted && (
                            <div className="space-y-1 pt-2 border-t border-[#F9F8F6]/[0.04]">
                                {completedTasks.map((task) => (
                                    <TaskRow
                                        key={task.id}
                                        task={task}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskRow({
    task,
    onToggle,
    onDelete,
}: {
    task: Task;
    onToggle: (id: string, nextCompleted: boolean) => void;
    onDelete: (id: string) => void;
}) {
    const isHourly = task.title.startsWith("[");
    const isExam = task.title.includes("EXAM:");
    const cleanTitle = task.title.replace(/\[.*?\]/g, "").trim();

    return (
        <div className="group flex items-center justify-between py-2 px-2.5 hover:bg-[#20201F]/60 rounded-[8px] transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Tactile Checkbox */}
                <button
                    type="button"
                    onClick={() => onToggle(task.id, !task.completed)}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    className={cn(
                        "size-5 rounded-[4px] border flex items-center justify-center transition-all shrink-0",
                        task.completed
                            ? "bg-[#66CC63] border-[#66CC63] text-[#0E0D0C]"
                            : "border-[#F9F8F6]/20 bg-[#161616] hover:border-[#F9F8F6]/50"
                    )}
                >
                    {task.completed && <Check className="size-3.5 stroke-[2.5]" />}
                </button>

                {/* Task Title & Metadata */}
                <div className="flex flex-col min-w-0 pr-3">
                    <span
                        className={cn(
                            "text-sm font-sans transition-colors truncate",
                            task.completed
                                ? "text-[#F9F8F6]/40 line-through"
                                : "text-[#F9F8F6]/90 font-medium"
                        )}
                    >
                        {cleanTitle}
                    </span>

                    {(isHourly || isExam) && (
                        <div className="flex items-center gap-2 mt-0.5">
                            {isHourly && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F9F8F6]/60 bg-[#20201F] px-1.5 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08]">
                                    <Clock className="size-3 text-[#66CC63]" />
                                    Time Block
                                </span>
                            )}
                            {isExam && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F87171] bg-[#F87171]/10 px-1.5 py-0.5 rounded-[4px] border border-[#F87171]/20">
                                    <GraduationCap className="size-3" />
                                    Exam Target
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Trigger */}
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete task"
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 size-7.5 rounded-[6px] text-[#F9F8F6]/40 hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all shrink-0"
            >
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    );
}
