import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits, tasks, exams } from "@/db/schema";
import { eq, and, asc, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CalendarDays, Flame } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null; // Handled by parent layout redirection
    }

    // 1. Query Neon for the next upcoming academic exam
    const nextExam = await db.query.exams.findFirst({
        where: eq(exams.userId, userId),
        orderBy: [asc(exams.date)],
    });

    // 2. Query Neon to count active uncompleted tasks
    const activeTasks = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.completed, false)));

    // 3. Query Neon for the highest active habit streak
    const topHabit = await db.query.habits.findFirst({
        where: eq(habits.userId, userId),
        orderBy: [desc(habits.streak)],
    });

    // Calculate exam countdown days
    let daysRemaining: number | null = null;
    if (nextExam) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(nextExam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {session?.user?.name?.split(" ")[0] || "User"}
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Here is a snapshot of your academic progress for today.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1: Next Exam */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500 dark:text-stone-400">
                            Next Exam
                        </CardTitle>
                        <CalendarDays className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                        {nextExam ? (
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {nextExam.subject}
                                </div>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {daysRemaining !== null &&
                                    daysRemaining >= 0
                                        ? `In ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`
                                        : "Today"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-stone-300 dark:text-stone-700">
                                    No Exams
                                </div>
                                <p className="text-xs text-stone-500">
                                    Record an exam to start tracking.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Card 2: Tasks Pending */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500 dark:text-stone-400">
                            Tasks Pending
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-stone-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold">
                                {activeTasks.length}
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                                Tasks remaining on your planner.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Top Habit Streak */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-stone-500 dark:text-stone-400">
                            Top Habit Streak
                        </CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        {topHabit && topHabit.streak > 0 ? (
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {topHabit.streak} Days
                                </div>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    Current streak for: {topHabit.name}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="text-2xl font-bold text-stone-300 dark:text-stone-700">
                                    0 Days
                                </div>
                                <p className="text-xs text-stone-500">
                                    Log your habits daily to build a streak.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
