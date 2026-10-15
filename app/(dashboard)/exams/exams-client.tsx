"use client";

import React, { useState } from "react";
import { createExam, deleteExam, addSyllabusTopic } from "./actions";
import { toggleTask, deleteTask } from "../planner/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar as CalendarIcon,
    Trash2,
    Plus,
    Timer,
    CheckCircle2,
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
import { format, differenceInDays, isPast } from "date-fns";
import { toast } from "sonner";

interface Exam {
    id: string;
    subject: string;
    date: Date;
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

export function ExamsClient({
    initialExams,
    initialSyllabusTasks,
    isPro,
}: ExamsClientProps) {
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [syllabusInputs, setSyllabusInputs] = useState<Record<string, string>>({});

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !date) {
            toast.error("Please provide both subject name and exam date.");
            return;
        }
        setIsCreating(true);
        try {
            await createExam(subject.trim(), date);
            setSubject("");
            setDate("");
            toast.success("Exam milestone registered.");
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PRO_LIMIT_REACHED"
            ) {
                toast.error("Upgrade to Pro to track unlimited exam roadmaps.");
            } else {
                toast.error("Failed to register milestone.");
            }
        } finally {
            setIsCreating(false);
        }
    };

    const handleAddTopic = async (examId: string, examDate: Date) => {
        const topicName = (syllabusInputs[examId] || "").trim();
        if (!topicName) return;

        try {
            await addSyllabusTopic(examId, topicName, examDate.toString());
            setSyllabusInputs((prev) => ({ ...prev, [examId]: "" }));
            toast.success("Syllabus module added.");
        } catch {
            toast.error("Failed to add syllabus module.");
        }
    };

    return (
        <div className="relative space-y-10 pb-16 max-w-6xl mx-auto">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-rose-500/[0.03] blur-3xl pointer-events-none rounded-full" />

            {/* --- HEADER --- */}
            <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                            Academic Milestones
                        </h1>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                            <GraduationCap className="size-3.5" />
                            Target Prep
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Map exam dates, monitor curriculum completion, and track required daily study velocity.
                    </p>
                </div>

                {!isPro ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/80 card-elevation text-xs">
                        <span className="text-muted-foreground font-medium">Free Milestone Limit:</span>
                        <span className="font-bold text-foreground">
                            {initialExams.length}/3
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                        <Sparkles className="size-3" />
                        <span>Pro Unlimited Roadmaps</span>
                    </div>
                )}
            </header>

            {/* --- CREATE MILESTONE COMMAND BAR --- */}
            <div className="rounded-xl border border-border/90 bg-card p-5 card-elevation">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-border/50 text-xs font-semibold text-foreground">
                    <BookOpen className="size-4 text-rose-500" />
                    <span>Register New Academic Target</span>
                </div>

                <form onSubmit={onCreate} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Course / Exam Title (e.g. Distributed Systems, USMLE Step 1)..."
                            className="h-10 text-xs bg-secondary/30 border-border/80 focus-visible:ring-1 focus-visible:ring-rose-500"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="h-10 text-xs bg-secondary/30 border-border/80 focus-visible:ring-1 focus-visible:ring-rose-500"
                        />
                    </div>
                    <div className="sm:col-span-3">
                        <Button
                            type="submit"
                            disabled={!subject.trim() || !date || isCreating}
                            className="btn-tactile w-full h-10 text-xs font-medium bg-foreground text-background hover:bg-foreground/90">
                            <Plus className="size-3.5 mr-1.5" />
                            Track Milestone
                        </Button>
                    </div>
                </form>
            </div>

            {/* --- EXAM ROADMAP CARDS --- */}
            <div className="space-y-6">
                {initialExams.length > 0 ? (
                    initialExams.map((exam) => {
                        const examDate = new Date(exam.date);
                        const daysLeft = differenceInDays(examDate, new Date());
                        const hasPassed = isPast(examDate);
                        const isUrgent = daysLeft <= 3 && !hasPassed;

                        // Syllabus tasks linked to this exam
                        const examTasks = initialSyllabusTasks.filter((t) =>
                            t.title.includes(`[EXAM:${exam.id}]`),
                        );
                        const totalModules = examTasks.length;
                        const completedModules = examTasks.filter((t) => t.completed).length;
                        const remainingModules = totalModules - completedModules;
                        const progress = totalModules
                            ? Math.round((completedModules / totalModules) * 100)
                            : 0;

                        // Daily Pacing Velocity Calculation
                        const dailyPaceNeeded =
                            daysLeft > 0 && remainingModules > 0
                                ? (remainingModules / daysLeft).toFixed(1)
                                : null;

                        return (
                            <div
                                key={exam.id}
                                className={cn(
                                    "rounded-xl border bg-card p-6 card-elevation transition-all group",
                                    isUrgent
                                        ? "border-rose-500/40 shadow-xs shadow-rose-500/5"
                                        : "border-border/90 hover:border-border",
                                )}>
                                <div className="grid md:grid-cols-12 gap-8 items-start">
                                    {/* Left Column (5 Cols): Exam Overview & Pacing Coach */}
                                    <div className="md:col-span-5 space-y-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                                                    Target Milestone
                                                </span>
                                                <h3 className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                                                    {exam.subject}
                                                </h3>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => deleteExam(exam.id)}
                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-7 rounded-md flex items-center justify-center transition-all"
                                                title="Delete milestone">
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>

                                        {/* Status & Countdown Badges */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
                                                    hasPassed
                                                        ? "bg-secondary text-muted-foreground border-border"
                                                        : isUrgent
                                                          ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                                          : "bg-amber-500/10 text-amber-500 border-amber-500/30",
                                                )}>
                                                {isUrgent ? (
                                                    <AlertTriangle className="size-3.5" />
                                                ) : (
                                                    <Timer className="size-3.5" />
                                                )}
                                                {hasPassed
                                                    ? "Exam Concluded"
                                                    : daysLeft === 0
                                                      ? "Exam Today"
                                                      : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} remaining`}
                                            </div>

                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-secondary/50 text-muted-foreground border border-border/80">
                                                <CalendarIcon className="size-3" />
                                                <span>{format(examDate, "EEE, MMM d, yyyy")}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Study Velocity Coach */}
                                        <div className="p-3.5 rounded-lg bg-secondary/30 border border-border/60 space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium flex items-center gap-1">
                                                    <Zap className="size-3 text-amber-500" />
                                                    Pacing Velocity
                                                </span>
                                                <span className="font-semibold text-foreground">
                                                    {remainingModules === 0 && totalModules > 0
                                                        ? "Syllabus Complete"
                                                        : dailyPaceNeeded
                                                          ? `${dailyPaceNeeded} modules/day`
                                                          : "Self-Paced"}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {remainingModules === 0 && totalModules > 0
                                                    ? "All mapped curriculum modules mastered. Time for revision!"
                                                    : dailyPaceNeeded
                                                      ? `Complete ${dailyPaceNeeded} curriculum chapters per day to cover the full syllabus before exam day.`
                                                      : "Add your curriculum modules to compute your recommended study pace."}
                                            </p>
                                        </div>

                                        {/* Readiness Meter */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">
                                                    Preparedness Gauge
                                                </span>
                                                <span className="font-bold text-foreground">
                                                    {progress}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        progress === 100
                                                            ? "bg-emerald-500"
                                                            : progress >= 60
                                                              ? "bg-emerald-500/80"
                                                              : "bg-amber-500",
                                                    )}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span>{completedModules} mastered</span>
                                                <span>{remainingModules} pending</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (7 Cols): Curriculum Checklist Breakdown */}
                                    <div className="md:col-span-7 space-y-4 md:border-l md:border-border/60 md:pl-8">
                                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                            <div className="flex items-center gap-2">
                                                <Layers className="size-4 text-muted-foreground" />
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                                    Curriculum Modules ({totalModules})
                                                </h4>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground">
                                                {completedModules}/{totalModules} Covered
                                            </span>
                                        </div>

                                        {/* Modules List */}
                                        <div className="space-y-2">
                                            {examTasks.length > 0 ? (
                                                examTasks.map((task, index) => {
                                                    const cleanTitle = task.title.split("]")[1]?.trim() || task.title;
                                                    const moduleNumber = String(index + 1).padStart(2, "0");

                                                    return (
                                                        <div
                                                            key={task.id}
                                                            className={cn(
                                                                "flex items-center justify-between p-3 rounded-lg border transition-all group/module",
                                                                task.completed
                                                                    ? "bg-secondary/20 border-border/40"
                                                                    : "bg-secondary/40 border-border/80 hover:border-emerald-500/40 hover:bg-secondary/60",
                                                            )}>
                                                            <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                                                                {/* Tactile Module Checkbox */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleTask(task.id, !task.completed)
                                                                    }
                                                                    className={cn(
                                                                        "size-5 rounded-md border flex items-center justify-center transition-all shrink-0 active:scale-95",
                                                                        task.completed
                                                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                                                            : "border-border/80 bg-card hover:border-emerald-500/60",
                                                                    )}>
                                                                    {task.completed && (
                                                                        <Check className="size-3 stroke-[2.5]" />
                                                                    )}
                                                                </button>

                                                                <span className="text-[10px] font-mono font-semibold text-muted-foreground shrink-0">
                                                                    M{moduleNumber}
                                                                </span>

                                                                <span
                                                                    className={cn(
                                                                        "text-xs font-medium truncate transition-all",
                                                                        task.completed
                                                                            ? "text-muted-foreground line-through decoration-muted-foreground/40"
                                                                            : "text-foreground",
                                                                    )}>
                                                                    {cleanTitle}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => deleteTask(task.id)}
                                                                className="opacity-0 group-hover/module:opacity-100 size-6 text-muted-foreground hover:text-destructive flex items-center justify-center transition-opacity shrink-0"
                                                                title="Remove module">
                                                                <Trash2 className="size-3" />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="py-6 text-center rounded-lg border border-dashed border-border/70 bg-secondary/10">
                                                    <p className="text-xs text-muted-foreground">
                                                        No syllabus chapters added yet.
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground/60 block mt-0.5">
                                                        Break this subject down into chapters or test topics below.
                                                    </span>
                                                </div>
                                            )}

                                            {/* Inline Add Topic Command */}
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
                                                        e.key === "Enter" &&
                                                        handleAddTopic(exam.id, examDate)
                                                    }
                                                    placeholder="Add chapter / syllabus module (e.g. Chapter 4: Neural Networks)..."
                                                    className="h-9 text-xs bg-card border-border/80 focus-visible:ring-1 focus-visible:ring-rose-500"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => handleAddTopic(exam.id, examDate)}
                                                    size="sm"
                                                    className="btn-tactile h-9 px-3.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 shrink-0">
                                                    <Plus className="size-3.5 mr-1" />
                                                    Add Chapter
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center rounded-xl border border-dashed border-border/80 bg-card card-elevation space-y-3">
                        <GraduationCap className="size-8 text-rose-500/60 mx-auto" />
                        <h3 className="text-base font-semibold text-foreground">
                            No academic milestones registered
                        </h3>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Register your upcoming exams, certifications, or project deadlines above. SmartTrack will automatically pace your daily preparation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
