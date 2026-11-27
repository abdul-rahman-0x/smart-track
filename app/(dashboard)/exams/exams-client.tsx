"use client";

import React, { useState, useMemo, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { createExam, deleteExam, addSyllabusTopic } from "./actions";
import { toggleTask, deleteTask } from "../planner/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar as CalendarIcon,
    Trash2,
    Plus,
    Timer,
    AlertTriangle,
    GraduationCap,
    BookOpen,
    Zap,
    Sparkles,
    Check,
    Layers,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays, isPast, startOfDay } from "date-fns";
import { toast } from "sonner";

interface Exam {
    id: string;
    subject: string;
    date: Date | string;
    notes: string | null;
}

interface SyllabusTask {
    id: string;
    title: string;
    completed: boolean;
}

interface ExamsClientProps {
    initialExams: Exam[];
    initialSyllabusTasks: SyllabusTask[];
    isPro: boolean;
}

type OptimisticExamAction =
    | { type: "DELETE_EXAM"; id: string }
    | { type: "ADD_EXAM"; exam: Exam };

type OptimisticTaskAction =
    | { type: "TOGGLE_TASK"; id: string; completed: boolean }
    | { type: "DELETE_TASK"; id: string }
    | { type: "ADD_TASK"; task: SyllabusTask };

const MAX_FREE_EXAMS = 3;

function parseDateSafely(d: Date | string): Date {
    const parsed = typeof d === "string" ? new Date(d) : d;
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function cleanModuleTitle(raw: string): string {
    return raw.replace(/\[EXAM:.*?\]\s*/g, "").trim();
}

export function ExamsClient({
    initialExams,
    initialSyllabusTasks,
    isPro,
}: ExamsClientProps) {
    const [, startTransition] = useTransition();
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [syllabusInputs, setSyllabusInputs] = useState<Record<string, string>>({});

    // Optimistic UI buffers
    const [optimisticExams, setOptimisticExams] = useOptimistic(
        initialExams,
        (state: Exam[], action: OptimisticExamAction) => {
            switch (action.type) {
                case "DELETE_EXAM":
                    return state.filter((e) => e.id !== action.id);
                case "ADD_EXAM":
                    return [action.exam, ...state];
                default:
                    return state;
            }
        }
    );

    const [optimisticTasks, setOptimisticTasks] = useOptimistic(
        initialSyllabusTasks,
        (state: SyllabusTask[], action: OptimisticTaskAction) => {
            switch (action.type) {
                case "TOGGLE_TASK":
                    return state.map((t) =>
                        t.id === action.id ? { ...t, completed: action.completed } : t
                    );
                case "DELETE_TASK":
                    return state.filter((t) => t.id !== action.id);
                case "ADD_TASK":
                    return [...state, action.task];
                default:
                    return state;
            }
        }
    );

    const isAtLimit = !isPro && optimisticExams.length >= MAX_FREE_EXAMS;
    const isNearLimit = !isPro && optimisticExams.length >= MAX_FREE_EXAMS - 1;

    // Macro metrics
    const stats = useMemo(() => {
        const totalRoadmaps = optimisticExams.length;
        const totalModules = optimisticTasks.length;
        const completedModules = optimisticTasks.filter((t) => t.completed).length;
        const averageReadiness =
            totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return { totalRoadmaps, totalModules, completedModules, averageReadiness };
    }, [optimisticExams, optimisticTasks]);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanSubject = subject.trim();
        if (!cleanSubject || !date) {
            toast.error("Subject and deadline are required.");
            return;
        }

        if (isAtLimit) {
            toast.error("Milestone capacity reached. Upgrade to Pro for unlimited roadmaps.");
            return;
        }

        setIsCreating(true);
        const tempId = `temp-exam-${crypto.randomUUID()}`;
        const newExamDate = new Date(date);

        startTransition(async () => {
            setOptimisticExams({
                type: "ADD_EXAM",
                exam: {
                    id: tempId,
                    subject: cleanSubject,
                    date: newExamDate,
                    notes: null,
                },
            });

            setSubject("");
            setDate("");

            try {
                await createExam(cleanSubject, date);
                toast.success("Target milestone registered.");
            } catch (error) {
                if (error instanceof Error && error.message === "PRO_LIMIT_REACHED") {
                    toast.error("Plan limit reached. Upgrade to Pro.");
                } else {
                    toast.error("Failed to commit milestone.");
                }
            } finally {
                setIsCreating(false);
            }
        });
    };

    const handleDeleteExam = (examId: string) => {
        startTransition(async () => {
            setOptimisticExamAction(examId);
            try {
                await deleteExam(examId);
                toast.success("Milestone purged.");
            } catch {
                toast.error("Failed to delete milestone.");
            }
        });
    };

    const setOptimisticExamAction = (id: string) => {
        setOptimisticExams({ type: "DELETE_EXAM", id });
    };

    const handleAddTopic = (examId: string, examDate: Date) => {
        const topicName = (syllabusInputs[examId] || "").trim();
        if (!topicName) return;

        // Use native UUID generation instead of impure Date.now()
        const tempId = `temp-task-${crypto.randomUUID()}`;
        const fullTitle = `[EXAM:${examId}] ${topicName}`;

        startTransition(async () => {
            setOptimisticTasks({
                type: "ADD_TASK",
                task: {
                    id: tempId,
                    title: fullTitle,
                    completed: false,
                },
            });

            setSyllabusInputs((prev) => ({ ...prev, [examId]: "" }));

            try {
                await addSyllabusTopic(examId, topicName, examDate.toISOString());
                toast.success("Module appended to syllabus.");
            } catch {
                toast.error("Failed to add module.");
            }
        });
    };

    const handleToggleModule = (taskId: string, nextStatus: boolean) => {
        startTransition(async () => {
            setOptimisticTasks({
                type: "TOGGLE_TASK",
                id: taskId,
                completed: nextStatus,
            });
            try {
                await toggleTask(taskId, nextStatus);
            } catch {
                toast.error("Failed to update module state.");
            }
        });
    };

    const handleDeleteModule = (taskId: string) => {
        startTransition(async () => {
            setOptimisticTasks({ type: "DELETE_TASK", id: taskId });
            try {
                await deleteTask(taskId);
                toast.success("Module removed.");
            } catch {
                toast.error("Failed to remove module.");
            }
        });
    };

    return (
        <div className="space-y-8 pb-16 max-w-6xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header & Controls */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            Academic Milestones & Syllabus
                        </h1>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9F8F6]/60 bg-[#161616] px-2 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08]">
                            VELOCITY
                        </span>
                    </div>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        Map assessment deadlines, manage curriculum breakdown, and automate pacing.
                    </p>
                </div>

                {/* Tier Quota */}
                {isPro ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#20201F] text-[#F9F8F6] text-xs font-mono border border-[#F9F8F6]/[0.12]">
                        <Sparkles className="size-3 text-[#66CC63]" />
                        <span>UNLIMITED ROADMAPS</span>
                    </div>
                ) : (
                    <Link
                        href="/pricing"
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-[8px] border text-xs font-mono transition-colors",
                            isAtLimit
                                ? "bg-[#B42318]/15 border-[#B42318]/40 text-[#F87171] hover:bg-[#B42318]/25"
                                : isNearLimit
                                    ? "bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24]/20"
                                    : "bg-[#161616] border-[#F9F8F6]/[0.08] text-[#F9F8F6]/60 hover:border-[#F9F8F6]/20"
                        )}
                    >
                        <span>ROADMAP CAP:</span>
                        <span className="font-bold text-[#F9F8F6]">{optimisticExams.length}/{MAX_FREE_EXAMS}</span>
                    </Link>
                )}
            </header>

            {/* Pro Upsell Alert on Limit */}
            {!isPro && isAtLimit && (
                <div className="rounded-[16px] border border-[#F9F8F6]/[0.12] bg-[#161616] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30">
                                Plan Gated
                            </span>
                            <span className="text-xs font-medium text-[#F9F8F6]">
                                Maximum free roadmaps reached (3/3)
                            </span>
                        </div>
                        <p className="text-xs text-[#F9F8F6]/60">
                            Free tiers support up to 3 active target assessments. Upgrade to Pro for unmetered course roadmaps.
                        </p>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        className="bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] font-sans font-medium text-xs h-8 px-3.5 rounded-[8px] shrink-0"
                    >
                        <Link href="/pricing" className="flex items-center gap-1">
                            Unlock All Roadmaps
                            <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                        </Link>
                    </Button>
                </div>
            )}

            {/* Macro Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricBox
                    label="Syllabus Mastery"
                    value={`${stats.averageReadiness}%`}
                    detail={`${stats.completedModules} of ${stats.totalModules} modules cleared`}
                    highlight
                />
                <MetricBox
                    label="Tracked Targets"
                    value={stats.totalRoadmaps.toString()}
                    detail="Active examination courses"
                />
                <MetricBox
                    label="Pending Modules"
                    value={(stats.totalModules - stats.completedModules).toString()}
                    detail="Remaining curriculum units"
                />
                <MetricBox
                    label="Pacing Engine"
                    value="Calculated"
                    detail="Daily velocity recommendations"
                />
            </div>

            {/* Register Target Command Bar */}
            <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#F9F8F6]/[0.06] text-xs font-mono uppercase tracking-wider text-[#F9F8F6]/60">
                    <BookOpen className="size-3.5" />
                    <span>Register Academic Milestone</span>
                </div>

                <form onSubmit={onCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={isAtLimit || isCreating}
                            placeholder="Assessment designation (e.g. Distributed Systems, Step 1, AWS SAA)..."
                            className="h-10 text-sm bg-[#0E0D0C]/40 border-[#F9F8F6]/[0.08] text-[#F9F8F6] placeholder:text-[#F9F8F6]/40 rounded-[8px] focus-visible:ring-1 focus-visible:ring-[#F9F8F6]/30"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={isAtLimit || isCreating}
                            className="h-10 text-sm bg-[#0E0D0C]/40 border-[#F9F8F6]/[0.08] text-[#F9F8F6] rounded-[8px] focus-visible:ring-1 focus-visible:ring-[#F9F8F6]/30"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <Button
                            type="submit"
                            disabled={!subject.trim() || !date || isCreating || isAtLimit}
                            className="w-full h-10 text-xs font-sans font-medium bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] rounded-[8px] shrink-0"
                        >
                            <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                            Establish Target
                        </Button>
                    </div>
                </form>
            </div>

            {/* Exam Roadmaps Matrix */}
            <div className="space-y-6">
                {optimisticExams.length > 0 ? (
                    optimisticExams.map((exam) => {
                        const examDate = parseDateSafely(exam.date);
                        const today = startOfDay(new Date());
                        const examDay = startOfDay(examDate);
                        const daysLeft = differenceInCalendarDays(examDay, today);
                        const hasPassed = isPast(examDay) && daysLeft < 0;
                        const isUrgent = daysLeft >= 0 && daysLeft <= 3 && !hasPassed;

                        const examTasks = optimisticTasks.filter((t) =>
                            t.title.includes(`[EXAM:${exam.id}]`)
                        );
                        const totalModules = examTasks.length;
                        const completedModules = examTasks.filter((t) => t.completed).length;
                        const remainingModules = totalModules - completedModules;
                        const progress = totalModules
                            ? Math.round((completedModules / totalModules) * 100)
                            : 0;

                        // Velocity calculation with calendar-day awareness
                        let paceLabel = "Self-Paced";
                        if (hasPassed) {
                            paceLabel = "Assessment Concluded";
                        } else if (remainingModules === 0 && totalModules > 0) {
                            paceLabel = "Curriculum Mastered";
                        } else if (daysLeft === 0) {
                            paceLabel = `${remainingModules} units pending today`;
                        } else if (daysLeft > 0 && remainingModules > 0) {
                            paceLabel = `${(remainingModules / daysLeft).toFixed(1)} units / day`;
                        }

                        return (
                            <div
                                key={exam.id}
                                className={cn(
                                    "rounded-[16px] border bg-[#161616] p-6 transition-colors group",
                                    isUrgent
                                        ? "border-[#F87171]/40"
                                        : "border-[#F9F8F6]/[0.08] hover:border-[#F9F8F6]/15"
                                )}
                            >
                                <div className="grid md:grid-cols-12 gap-8 items-start">
                                    {/* Left Column: Macro Assessment Summary */}
                                    <div className="md:col-span-5 space-y-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9F8F6]/60 block">
                                                    Target Assessment
                                                </span>
                                                <h3 className="text-xl font-medium tracking-tight text-[#F9F8F6] mt-0.5">
                                                    {exam.subject}
                                                </h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExam(exam.id)}
                                                className="opacity-0 group-hover:opacity-100 text-[#F9F8F6]/40 hover:text-[#F87171] hover:bg-[#B42318]/10 size-7.5 rounded-[6px] flex items-center justify-center transition-all"
                                                aria-label="Delete milestone"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>

                                        {/* Countdown and Date Pills */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-mono border",
                                                    hasPassed
                                                        ? "bg-[#20201F] text-[#F9F8F6]/40 border-[#F9F8F6]/[0.08]"
                                                        : isUrgent
                                                            ? "bg-[#B42318]/15 text-[#F87171] border-[#B42318]/30"
                                                            : "bg-[#20201F] text-[#F9F8F6]/80 border-[#F9F8F6]/[0.1]"
                                                )}
                                            >
                                                {isUrgent ? (
                                                    <AlertTriangle className="size-3 text-[#F87171]" />
                                                ) : (
                                                    <Timer className="size-3" />
                                                )}
                                                <span>
                                                    {hasPassed
                                                        ? "Concluded"
                                                        : daysLeft === 0
                                                            ? "Examination Today"
                                                            : `${daysLeft}d remaining`}
                                                </span>
                                            </div>

                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-xs font-mono bg-[#20201F] text-[#F9F8F6]/60 border border-[#F9F8F6]/[0.08]">
                                                <CalendarIcon className="size-3" />
                                                <span>{format(examDate, "EEE, MMM d, yyyy")}</span>
                                            </div>
                                        </div>

                                        {/* Pacing Velocity Box */}
                                        <div className="p-3.5 rounded-[8px] bg-[#20201F]/60 border border-[#F9F8F6]/[0.08] space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-[#F9F8F6]/60 flex items-center gap-1.5">
                                                    <Zap className="size-3 text-[#FBBF24]" />
                                                    PACING REQUIRED
                                                </span>
                                                <span className="text-[#F9F8F6] font-medium">{paceLabel}</span>
                                            </div>
                                            <p className="text-[11px] font-sans text-[#F9F8F6]/50 leading-relaxed">
                                                {hasPassed
                                                    ? "This academic assessment cycle has completed."
                                                    : remainingModules === 0 && totalModules > 0
                                                        ? "Full mapped syllabus cleared. Proceed to timed mock examinations."
                                                        : daysLeft > 0 && remainingModules > 0
                                                            ? `Complete ${(remainingModules / daysLeft).toFixed(1)} curriculum modules per day to finalize preparation before assessment date.`
                                                            : "Map curriculum modules on the right to trigger automated pacing calculations."}
                                            </p>
                                        </div>

                                        {/* Readiness Gauge */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-mono">
                                                <span className="text-[#F9F8F6]/60">CURRICULUM READINESS</span>
                                                <span className="text-[#F9F8F6] font-medium">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-[#20201F] h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        progress === 100 ? "bg-[#66CC63]" : "bg-[#F9F8F6]/80"
                                                    )}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[11px] font-mono text-[#F9F8F6]/40">
                                                <span>{completedModules} mastered</span>
                                                <span>{remainingModules} pending</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Curriculum Modules Breakdown */}
                                    <div className="md:col-span-7 space-y-4 md:border-l md:border-[#F9F8F6]/[0.06] md:pl-8">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#F9F8F6]/[0.06]">
                                            <div className="flex items-center gap-2">
                                                <Layers className="size-4 text-[#F9F8F6]/60" />
                                                <h4 className="text-xs font-mono uppercase tracking-wider text-[#F9F8F6]">
                                                    Curriculum Units ({totalModules})
                                                </h4>
                                            </div>
                                            <span className="text-xs font-mono text-[#F9F8F6]/60">
                                                {completedModules}/{totalModules} Cleared
                                            </span>
                                        </div>

                                        {/* Modules Checklist */}
                                        <div className="space-y-2">
                                            {examTasks.length > 0 ? (
                                                examTasks.map((task, index) => {
                                                    const cleanTitle = cleanModuleTitle(task.title);
                                                    const moduleIdx = String(index + 1).padStart(2, "0");

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className={cn(
                                                                "flex items-center justify-between p-3 rounded-[8px] border transition-colors group/module",
                                                                task.completed
                                                                    ? "bg-[#0E0D0C]/20 border-[#F9F8F6]/[0.04]"
                                                                    : "bg-[#20201F]/40 border-[#F9F8F6]/[0.08] hover:border-[#F9F8F6]/20"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleModule(task.id, !task.completed)}
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

                                                                <span className="text-[11px] font-mono text-[#F9F8F6]/40 shrink-0">
                                                                    M{moduleIdx}
                                                                </span>

                                                                <span
                                                                    className={cn(
                                                                        "text-sm font-sans truncate transition-colors",
                                                                        task.completed
                                                                            ? "text-[#F9F8F6]/40 line-through"
                                                                            : "text-[#F9F8F6]/90 font-medium"
                                                                    )}
                                                                >
                                                                    {cleanTitle}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteModule(task.id)}
                                                                className="opacity-0 group-hover/module:opacity-100 size-7 text-[#F9F8F6]/40 hover:text-[#F87171] hover:bg-[#B42318]/10 rounded-[4px] flex items-center justify-center transition-all shrink-0"
                                                                aria-label="Remove module"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-8 text-center rounded-[8px] border border-dashed border-[#F9F8F6]/[0.08] space-y-1">
                                                    <p className="text-xs font-sans text-[#F9F8F6]/60">
                                                        No curriculum modules registered for this target.
                                                    </p>
                                                    <p className="text-[11px] font-mono text-[#F9F8F6]/30">
                                                        Add modules below to calculate velocity recommendations.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Add Module Input Bar */}
                                            <div className="flex gap-2 pt-2">
                                                <Input
                                                    value={syllabusInputs[exam.id] || ""}
                                                    onChange={(e) =>
                                                        setSyllabusInputs((prev) => ({
                                                            ...prev,
                                                            [exam.id]: e.target.value,
                                                        }))
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === "Enter" && handleAddTopic(exam.id, examDate)
                                                    }
                                                    placeholder="Register syllabus unit (e.g. Chapter 4: Distributed Consensus)..."
                                                    className="h-9 text-sm bg-[#0E0D0C]/40 border-[#F9F8F6]/[0.08] text-[#F9F8F6] placeholder:text-[#F9F8F6]/40 rounded-[8px] focus-visible:ring-1 focus-visible:ring-[#F9F8F6]/30"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddTopic(exam.id, examDate)}
                                                    size="sm"
                                                    className="h-9 px-3.5 text-xs font-sans font-medium bg-[#20201F] text-[#F9F8F6] hover:bg-[#2A2A29] border border-[#F9F8F6]/[0.1] rounded-[8px] shrink-0"
                                                >
                                                    <Plus className="size-3.5 mr-1" />
                                                    Add Module
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-16 text-center rounded-[16px] border border-dashed border-[#F9F8F6]/[0.08] bg-[#161616] space-y-3">
                        <GraduationCap className="size-8 text-[#F9F8F6]/30 mx-auto" />
                        <h3 className="text-base font-medium text-[#F9F8F6]">
                            No active assessment roadmaps
                        </h3>
                        <p className="text-xs font-sans text-[#F9F8F6]/60 max-w-md mx-auto leading-relaxed">
                            Register upcoming exams, technical certifications, or thesis deadlines. The pacing engine will calibrate daily completion quotas.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricBox({
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
