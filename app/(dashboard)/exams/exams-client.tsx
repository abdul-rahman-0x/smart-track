"use client";

import React, { useState } from "react";
import { createExam, deleteExam, addSyllabusTopic } from "./actions";
import { toggleTask, deleteTask } from "../planner/actions"; // Reuse your existing robust planner actions
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
    Calendar,
    Trash,
    Plus,
    Hourglass,
    Award,
    AlertCircle,
} from "lucide-react";

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
    dueDate: Date | null;
}

interface ExamsClientProps {
    initialExams: Exam[];
    initialSyllabusTasks: SyllabusTask[];
}

export function ExamsClient({
    initialExams,
    initialSyllabusTasks,
}: ExamsClientProps) {
    const [newSubject, setNewSubject] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [syllabusInputs, setSyllabusInputs] = useState<
        Record<string, string>
    >({});

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.trim() || !newDate) return;
        await createExam(newSubject, newDate, newNotes);
        setNewSubject("");
        setNewDate("");
        setNewNotes("");
    };

    const handleAddTopic = async (examId: string, examDateStr: string) => {
        const title = syllabusInputs[examId];
        if (!title || !title.trim()) return;

        setSyllabusInputs((prev) => ({ ...prev, [examId]: "" })); // Snap-clear input
        await addSyllabusTopic(examId, title, examDateStr);
    };

    // Helper to calculate countdown metrics
    const getCountdownStats = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const examDate = new Date(date);
        examDate.setHours(0, 0, 0, 0);

        const diffTime = examDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0)
            return {
                label: "Completed",
                color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                icon: Award,
                days: diffDays,
            };
        if (diffDays <= 3)
            return {
                label: `${diffDays}d left`,
                color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
                icon: AlertCircle,
                days: diffDays,
            };
        return {
            label: `${diffDays}d left`,
            color: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700",
            icon: Hourglass,
            days: diffDays,
        };
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Academic Exams
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Proactive milestone planning. Track deadlines, count study
                    days, and monitor syllabus coverage.
                </p>
            </div>

            {/* Add New Exam Form Card */}
            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                <CardContent className="pt-6">
                    <form onSubmit={handleCreateExam} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Input
                                placeholder="Subject / Course (e.g., Computer Science)"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                required
                                className="bg-stone-50 dark:bg-stone-950"
                            />
                            <Input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                required
                                className="bg-stone-50 dark:bg-stone-950"
                            />
                            <Input
                                placeholder="Brief prep notes (optional)"
                                value={newNotes}
                                onChange={(e) => setNewNotes(e.target.value)}
                                className="bg-stone-50 dark:bg-stone-950"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto flex gap-2">
                            <Plus className="w-4 h-4" /> Add Exam Milestone
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Exams Timeline Listing */}
            <div className="space-y-6">
                {initialExams.length > 0 ? (
                    initialExams.map((exam) => {
                        const stats = getCountdownStats(exam.date);
                        const StatusIcon = stats.icon;

                        // Filter out syllabus chapters for this specific exam
                        const prefix = `[EXAM:${exam.id}]`;
                        const examSyllabus = initialSyllabusTasks.filter((t) =>
                            t.title.startsWith(prefix),
                        );
                        const totalSyllabus = examSyllabus.length;
                        const completedSyllabus = examSyllabus.filter(
                            (t) => t.completed,
                        ).length;
                        const syllabusProgress =
                            totalSyllabus > 0
                                ? Math.round(
                                      (completedSyllabus / totalSyllabus) * 100,
                                  )
                                : 0;

                        return (
                            <Card
                                key={exam.id}
                                className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                                <CardContent className="p-6 space-y-6">
                                    {/* Top Column: Name, Date and Countdown */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold">
                                                {exam.subject}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>
                                                    {new Date(
                                                        exam.date,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-start sm:self-auto">
                                            <div
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${stats.color}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                <span>{stats.label}</span>
                                            </div>
                                            <button
                                                onClick={async () =>
                                                    await deleteExam(exam.id)
                                                }
                                                className="text-stone-400 hover:text-red-500"
                                                title="Delete milestone">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body Columns: Notes & Syllabus Checklist split */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Left Grid: Notes panel */}
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">
                                                Study Guidelines & Notes
                                            </h4>
                                            {exam.notes ? (
                                                <p className="text-sm bg-stone-50 dark:bg-stone-950 p-4 rounded-xl text-stone-600 dark:text-stone-300 leading-relaxed border border-stone-100 dark:border-stone-800">
                                                    {exam.notes}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-stone-400 italic">
                                                    No notes added for this
                                                    exam.
                                                </p>
                                            )}
                                        </div>

                                        {/* Right Grid: Interactive Syllabus Checklists */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
                                                <span>Syllabus Coverage</span>
                                                <span className="text-stone-600 dark:text-stone-300 font-bold">
                                                    {completedSyllabus}/
                                                    {totalSyllabus} Topics
                                                </span>
                                            </div>

                                            <Progress
                                                value={syllabusProgress}
                                                className="h-2 bg-stone-50 dark:bg-stone-950"
                                            />

                                            <div className="space-y-2 pt-2">
                                                {examSyllabus.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="flex items-center justify-between gap-2 group">
                                                        <div className="flex items-center gap-2.5">
                                                            <Checkbox
                                                                checked={
                                                                    task.completed
                                                                }
                                                                onCheckedChange={async (
                                                                    checked,
                                                                ) => {
                                                                    await toggleTask(
                                                                        task.id,
                                                                        !!checked,
                                                                    );
                                                                }}
                                                            />
                                                            <span
                                                                className={`text-xs font-medium ${task.completed ? "line-through text-stone-400" : ""}`}>
                                                                {task.title
                                                                    .replace(
                                                                        prefix,
                                                                        "",
                                                                    )
                                                                    .trim()}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={async () =>
                                                                await deleteTask(
                                                                    task.id,
                                                                )
                                                            }
                                                            className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                                            <Trash className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add Syllabus Topic Form Inline */}
                                                <div className="flex gap-2 pt-2 border-t border-dashed border-stone-100 dark:border-stone-800">
                                                    <Input
                                                        placeholder="Add study chapter or topic..."
                                                        value={
                                                            syllabusInputs[
                                                                exam.id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            setSyllabusInputs(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [exam.id]:
                                                                        e.target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        className="h-8 text-xs bg-stone-50 dark:bg-stone-950 px-2 shadow-none border-none focus-visible:ring-1 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-800"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddTopic(
                                                                exam.id,
                                                                new Date(
                                                                    exam.date,
                                                                )
                                                                    .toISOString()
                                                                    .split(
                                                                        "T",
                                                                    )[0],
                                                            )
                                                        }
                                                        size="icon"
                                                        className="h-8 w-8">
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl dark:border-stone-800">
                        <p className="text-stone-400">
                            No exams listed. Create your first milestone card
                            above to start tracking!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
