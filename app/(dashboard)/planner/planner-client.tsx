"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Trash2, Calendar, Target, Zap } from "lucide-react";
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
    isPro,
    selectedDateStr,
}: PlannerClientProps) {
    const [val, setVal] = useState("");

    const onAdd = async (priority: "high" | "medium") => {
        if (!val.trim()) return;
        try {
            await createPlannerTask({
                title: val,
                priority,
                dueDateStr: selectedDateStr,
            });
            setVal("");
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PRO_LIMIT_REACHED"
            ) {
                toast.error("Upgrade to Pro for unlimited tasks.");
            } else {
                toast.error("Failed to create task.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        Agenda
                    </h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
                        {format(new Date(selectedDateStr), "MMMM do, yyyy")}
                    </p>
                </div>
                {!isPro && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-tighter">
                        Free Tier: {initialTasks.length}/10 Tasks
                    </div>
                )}
            </header>

            <div className="relative group">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onAdd("medium")}
                    placeholder="Press Enter to add a task..."
                    className="h-12 pl-10 bg-secondary/10 border-border/40 rounded-xl focus-visible:ring-primary/20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                        onClick={() => onAdd("high")}
                        size="sm"
                        variant="ghost"
                        className="h-8 text-[10px] font-bold uppercase hover:bg-primary/10 hover:text-primary">
                        Focus
                    </Button>
                </div>
            </div>

            <div className="grid gap-10">
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-500">
                        <Target className="size-4" />
                        <h2 className="text-[11px] font-bold uppercase tracking-widest">
                            Critical Focus
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {initialTasks
                            .filter((t) => t.priority === "high")
                            .map((task) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Calendar className="size-4" />
                        <h2 className="text-[11px] font-bold uppercase tracking-widest">
                            Daily Log
                        </h2>
                    </div>
                    <div className="divide-y divide-border/20 border-t border-border/20">
                        {initialTasks
                            .filter((t) => t.priority !== "high")
                            .map((task) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function TaskRow({ task }: { task: Task }) {
    const isHourly = task.title.startsWith("[");
    const isExam = task.title.includes("EXAM:");

    return (
        <div className="group flex items-center justify-between py-3 transition-all">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => toggleTask(task.id, !task.completed)}
                    className={cn(
                        "size-5 rounded-full border-2 transition-all flex items-center justify-center",
                        task.completed
                            ? "bg-primary border-primary shadow-sm shadow-primary/20"
                            : "border-border/60 hover:border-primary/50",
                    )}>
                    {task.completed && (
                        <div className="size-1.5 rounded-full bg-background" />
                    )}
                </button>

                <div className="flex flex-col">
                    <span
                        className={cn(
                            "text-sm font-medium transition-all",
                            task.completed
                                ? "text-muted-foreground/40 line-through"
                                : "text-foreground/90",
                        )}>
                        {task.title.replace(/\[.*?\]/g, "").trim()}
                    </span>
                    <div className="flex gap-2">
                        {isHourly && (
                            <span className="text-[9px] font-bold text-primary/60 uppercase tracking-tighter">
                                Scheduled Block
                            </span>
                        )}
                        {isExam && (
                            <span className="text-[9px] font-bold text-orange-500/60 uppercase tracking-tighter">
                                Academic Requirement
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all">
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}
