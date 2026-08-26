"use client";

import React, { useState } from "react";
import { createExam, deleteExam, addSyllabusTopic } from "./actions";
import { toggleTask, deleteTask } from "../planner/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Calendar,
    Trash2,
    Plus,
    Timer,
    CheckCircle2,
    AlertTriangle,
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
    const [syllabusInputs, setSyllabusInputs] = useState<
        Record<string, string>
    >({});

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createExam(subject, date);
            setSubject("");
            setDate("");
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PRO_LIMIT_REACHED"
            ) {
                toast.error("Upgrade to Pro to track more exams.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex items-center justify-between border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Milestones
                    </h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
                        Academic Roadmap
                    </p>
                </div>
                {!isPro && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                        Free: {initialExams.length}/3
                    </div>
                )}
            </header>

            <form
                onSubmit={onCreate}
                className="flex flex-wrap gap-3 p-4 rounded-xl border border-border/40 bg-secondary/5">
                <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject Name..."
                    className="flex-1 min-w-50 h-9 text-xs bg-background border-border/40"
                />
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-auto h-9 text-xs bg-background border-border/40"
                />
                <Button
                    size="sm"
                    className="h-9 px-6 text-[10px] font-bold uppercase tracking-wider">
                    <Plus className="size-3 mr-2" /> Add Exam
                </Button>
            </form>

            <div className="grid gap-8">
                {initialExams.map((exam) => {
                    const daysLeft = differenceInDays(
                        new Date(exam.date),
                        new Date(),
                    );
                    const isUrgent =
                        daysLeft <= 3 && !isPast(new Date(exam.date));
                    const examTasks = initialSyllabusTasks.filter((t) =>
                        t.title.includes(`[EXAM:${exam.id}]`),
                    );
                    const progress = examTasks.length
                        ? Math.round(
                              (examTasks.filter((t) => t.completed).length /
                                  examTasks.length) *
                                  100,
                          )
                        : 0;

                    return (
                        <div
                            key={exam.id}
                            className="grid md:grid-cols-12 gap-8 p-6 rounded-2xl border border-border/40 bg-background/50 group relative">
                            <div className="md:col-span-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-lg font-bold tracking-tight">
                                        {exam.subject}
                                    </h3>
                                    <button
                                        onClick={() => deleteExam(exam.id)}
                                        className="opacity-0 group-hover:opacity-100 text-destructive/40 hover:text-destructive transition-opacity">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>

                                <div
                                    className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest",
                                        isUrgent
                                            ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                            : "bg-secondary/20 border-border/40 text-muted-foreground",
                                    )}>
                                    {isUrgent ? (
                                        <AlertTriangle className="size-3" />
                                    ) : (
                                        <Timer className="size-3" />
                                    )}
                                    {isPast(new Date(exam.date))
                                        ? "Completed"
                                        : `${daysLeft} Days Remaining`}
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60 font-medium italic">
                                    <Calendar className="size-3" />
                                    {format(new Date(exam.date), "PPP")}
                                </div>
                            </div>

                            <div className="md:col-span-8 space-y-6 md:border-l border-border/20 md:pl-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-50">
                                        <span>Syllabus Coverage</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress
                                        value={progress}
                                        className="h-1.5 bg-secondary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    {examTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between group/task">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        toggleTask(
                                                            task.id,
                                                            !task.completed,
                                                        )
                                                    }
                                                    className={cn(
                                                        "size-4 rounded-full border-2 transition-all",
                                                        task.completed
                                                            ? "bg-primary border-primary"
                                                            : "border-border/60",
                                                    )}>
                                                    {task.completed && (
                                                        <CheckCircle2 className="size-2.5 text-background mx-auto" />
                                                    )}
                                                </button>
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium",
                                                        task.completed
                                                            ? "text-muted-foreground/40 line-through"
                                                            : "text-foreground/80",
                                                    )}>
                                                    {task.title
                                                        .split("]")[1]
                                                        .trim()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteTask(task.id)
                                                }
                                                className="opacity-0 group-hover/task:opacity-100 text-destructive/30 hover:text-destructive">
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="flex gap-2 pt-2">
                                        <Input
                                            value={
                                                syllabusInputs[exam.id] || ""
                                            }
                                            onChange={(e) =>
                                                setSyllabusInputs((prev) => ({
                                                    ...prev,
                                                    [exam.id]: e.target.value,
                                                }))
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                addSyllabusTopic(
                                                    exam.id,
                                                    syllabusInputs[exam.id],
                                                    exam.date.toString(),
                                                )
                                            }
                                            placeholder="Add study topic..."
                                            className="h-8 text-[10px] bg-secondary/5 border-border/20 rounded-lg"
                                        />
                                        <Button
                                            onClick={() =>
                                                addSyllabusTopic(
                                                    exam.id,
                                                    syllabusInputs[exam.id],
                                                    exam.date.toString(),
                                                )
                                            }
                                            size="icon"
                                            className="size-8 rounded-lg">
                                            <Plus className="size-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
