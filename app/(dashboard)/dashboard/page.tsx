import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
    habits,
    tasks,
    exams,
    subscriptions,
    habitCompletions,
    syllabusItems,
} from "@/db/schema";
import { eq, and, asc, desc, gte, lte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Clock,
    Calendar,
    Sparkles,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    ListTodo,
    GraduationCap,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch Subscription Status (PRO vs FREE)
    const userSub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });
    const isPro =
        userSub?.status === "active" || userSub?.status === "trialing";

    // 2. Fetch Closest Exam Milestone (Next 3 upcoming exams)
    const upcomingExamsList = await db.query.exams.findMany({
        where: and(eq(exams.userId, userId), gte(exams.date, today)),
        orderBy: [asc(exams.date)],
        limit: 3,
    });

    const nextExam = upcomingExamsList[0];

    // Calculate countdown days for next exam
    let daysRemaining: number | null = null;
    if (nextExam) {
        const examDate = new Date(nextExam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 3. Fetch Syllabus Progress
    const allSyllabusItems = await db
        .select()
        .from(syllabusItems)
        .innerJoin(exams, eq(syllabusItems.examId, exams.id))
        .where(eq(exams.userId, userId));

    const totalSyllabus = allSyllabusItems.length;
    const completedSyllabus = allSyllabusItems.filter(
        (item) => item.syllabus_item.completed,
    ).length;
    const syllabusProgress =
        totalSyllabus > 0
            ? Math.round((completedSyllabus / totalSyllabus) * 100)
            : 0;

    // 4. Calculate active week's daily completed focus sessions
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weeklyFocusTasks = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.userId, userId),
                gte(tasks.dueDate, monday),
                lte(tasks.dueDate, sunday),
                eq(tasks.completed, true),
                eq(tasks.title, "[FOCUS] 25m Focus Session"),
            ),
        );

    // Group focus minutes by day
    const weeklyFocusMinutes = [0, 0, 0, 0, 0, 0, 0]; // Mon - Sun
    let totalWeekFocusMinutes = 0;

    weeklyFocusTasks.forEach((task) => {
        if (!task.dueDate) return;
        const taskDay = new Date(task.dueDate).getDay();
        const index = taskDay === 0 ? 6 : taskDay - 1;
        weeklyFocusMinutes[index] += 25;
        totalWeekFocusMinutes += 25;
    });

    const focusHours = (totalWeekFocusMinutes / 60).toFixed(1);

    // 5. Fetch all tasks for today
    const allTodayTasks = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.userId, userId),
                gte(tasks.dueDate, today),
                lte(tasks.dueDate, endOfDay),
            ),
        );

    // Calculate today's completed focus count
    const focusCount = allTodayTasks.filter(
        (t) => t.completed && t.title === "[FOCUS] 25m Focus Session",
    ).length;

    // Filter out focus logs from general task lists and count progress
    const todayUserTasks = allTodayTasks.filter(
        (t) => !t.title.startsWith("[FOCUS]"),
    );
    const completedTodayTasks = todayUserTasks.filter(
        (t) => t.completed,
    ).length;
    const totalTodayTasks = todayUserTasks.length;
    const taskProgressPercentage =
        totalTodayTasks > 0
            ? Math.round((completedTodayTasks / totalTodayTasks) * 100)
            : 0;

    // 6. Fetch habits sorted by highest streak
    const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
        orderBy: [desc(habits.streak)],
        limit: 4,
    });

    // Query relational completions table to find out how many habits were checked off today
    const todayCompletions = await db
        .select()
        .from(habitCompletions)
        .where(
            and(
                gte(habitCompletions.completedAt, today),
                lte(habitCompletions.completedAt, endOfDay),
            ),
        );

    const completedHabitsToday = userHabits.filter((h) =>
        todayCompletions.some((c) => c.habitId === h.id),
    ).length;

    const totalHabits = userHabits.length;
    const habitsProgressPercentage =
        totalHabits > 0
            ? Math.round((completedHabitsToday / totalHabits) * 100)
            : 0;

    // Calculate circular SVG progress offset for outer progress rings
    const outerCirc = 226;
    const outerOffset =
        outerCirc - (outerCirc * habitsProgressPercentage) / 100;

    const middleCirc = 176;
    const middleOffset =
        middleCirc - (middleCirc * taskProgressPercentage) / 100;

    const innerCirc = 125;
    const innerOffset = innerCirc - (innerCirc * syllabusProgress) / 100;

    // Format Name
    const nameParts = session?.user?.name?.split(" ");
    const displayName =
        nameParts && nameParts.length > 0
            ? nameParts.slice(0, 2).join(" ")
            : "User";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header and Plan Status Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 dark:border-stone-800 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Welcome back, {displayName}
                        </h2>
                        {isPro ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Sparkles className="w-3 h-3 fill-current" />
                                PRO MEMBER
                            </span>
                        ) : (
                            <Link
                                href="/billing"
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200/40 dark:border-stone-800/40">
                                FREE PLAN • UPGRADE
                            </Link>
                        )}
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        {today.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* --- LAYER 1: 3 BENTO METRICS CARDS --- */}
            <div className="grid gap-6 sm:grid-cols-3">
                {/* Card 1: Focus State */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Focus State
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">
                            {focusHours} Hours Focused
                        </div>
                        <p className="text-[10px] text-stone-400 leading-tight">
                            {focusCount >= 2
                                ? "Daily focus block target achieved! 🧘"
                                : `${focusCount}/2 completed sessions logged today.`}
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Syllabus Progress */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Syllabus Progress
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-2xl font-bold">
                            {syllabusProgress}% Completed
                        </div>

                        {/* Symmetrical Segmented Stripe Progress Bar */}
                        <div className="flex gap-1">
                            {Array.from({ length: 20 }).map((_, idx) => {
                                const segmentValue = (idx + 1) * 5;
                                const isActive =
                                    syllabusProgress >= segmentValue;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex-1 h-3 rounded-[1px] ${
                                            isActive
                                                ? "bg-orange-500 dark:bg-orange-500"
                                                : "bg-stone-100 dark:bg-stone-800"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Next Exam Countdown */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Next Milestone
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {nextExam ? (
                            <div className="space-y-0.5">
                                <div className="text-md font-bold truncate leading-tight">
                                    {nextExam.subject}
                                </div>
                                <p className="text-xs font-semibold text-rose-500">
                                    {daysRemaining !== null &&
                                    daysRemaining >= 0
                                        ? `Exam in ${daysRemaining} days`
                                        : "Exam is today"}
                                </p>
                            </div>
                        ) : (
                            <Link
                                href="/exams"
                                className="text-xs font-bold text-stone-400 flex items-center gap-1 hover:underline pt-1">
                                Log your first exam milestone{" "}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ==================== ROW 2: 1 WIDE ANALYTICS CARD WITH WORK ACTIVITY RINGS ==================== */}
            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-6 rounded-2xl">
                <div className="grid gap-6 md:grid-cols-5 items-center">
                    {/* Left Columns (col-span-3): Radial Rings Explanation */}
                    <div className="md:col-span-3 space-y-4">
                        <div>
                            <span className="block text-[10px] uppercase font-bold text-stone-400">
                                Work Activity
                            </span>
                            <h3 className="text-xl font-bold tracking-tight">
                                Active progression in one place
                            </h3>
                        </div>

                        <div className="grid gap-3 pt-2 text-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="font-semibold text-stone-600 dark:text-stone-300">
                                    Habit Streaks Tracker:
                                </span>
                                <span className="text-stone-400">
                                    {completedHabitsToday}/{totalHabits}{" "}
                                    completed today ({habitsProgressPercentage}
                                    %)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="font-semibold text-stone-600 dark:text-stone-300">
                                    Planner Tasks Checklist:
                                </span>
                                <span className="text-stone-400">
                                    {completedTodayTasks}/{totalTodayTasks}{" "}
                                    completed today ({taskProgressPercentage}%)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="font-semibold text-stone-600 dark:text-stone-300">
                                    Academic Syllabus Progress:
                                </span>
                                <span className="text-stone-400">
                                    {completedSyllabus}/{totalSyllabus} chapters
                                    studied ({syllabusProgress}%)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns (col-span-2): Concentric Progress Rings */}
                    <div className="md:col-span-2 flex items-center justify-center pt-4 md:pt-0">
                        <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg
                                className="w-full h-full transform -rotate-90"
                                viewBox="0 0 100 100">
                                {/* 1. Outer Ring (Orange) - Habits */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="36"
                                    className="stroke-stone-100 dark:stroke-stone-800"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="36"
                                    className="stroke-orange-500"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={outerCirc}
                                    strokeDashoffset={outerOffset}
                                    strokeLinecap="round"
                                />

                                {/* 2. Middle Ring (Blue/Indigo) - Tasks */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="28"
                                    className="stroke-stone-100 dark:stroke-stone-800"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="28"
                                    className="stroke-indigo-500"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={middleCirc}
                                    strokeDashoffset={middleOffset}
                                    strokeLinecap="round"
                                />

                                {/* 3. Inner Ring (Emerald) - Exams */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="20"
                                    className="stroke-stone-100 dark:stroke-stone-800"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="20"
                                    className="stroke-emerald-500"
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={innerCirc}
                                    strokeDashoffset={innerOffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center text-stone-400">
                                <Activity size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ==================== ROW 3: INTERACTIVE CHECKLISTS & ACTIVE EXAMS TIMELINE ==================== */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column (col-span-2): Today's Active Tasks Checklist */}
                <Card className="md:col-span-2 border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-6 rounded-2xl">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <ListTodo className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                                Today&apos;s Priority Agenda
                            </h4>
                        </div>

                        <div className="divide-y divide-stone-100 dark:divide-stone-800 min-h-[140px] flex flex-col justify-center">
                            {todayUserTasks.length > 0 ? (
                                todayUserTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <CheckCircle2
                                            className={`w-4 h-4 ${task.completed ? "text-emerald-500" : "text-stone-300 dark:text-stone-700"}`}
                                        />
                                        <span
                                            className={`text-xs font-semibold ${task.completed ? "line-through text-stone-400" : ""}`}>
                                            {task.title.startsWith("[")
                                                ? task.title
                                                      .split("]")[1]
                                                      .trim()
                                                : task.title}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 space-y-3">
                                    <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
                                        You have no specific tasks scheduled for
                                        today. Reclaim your focus by setting
                                        daily targets inside your planner.
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 text-xs border-stone-200 dark:border-stone-800">
                                        <Link href="/planner">
                                            Go to Planner ➔
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Right Column (col-span-1): Upcoming Exams Timeline */}
                <Card className="md:col-span-1 border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-none p-6 rounded-2xl">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
                            <GraduationCap className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                                Exams Timeline
                            </h4>
                        </div>

                        <div className="divide-y divide-stone-100 dark:divide-stone-800 min-h-[140px] flex flex-col justify-center">
                            {upcomingExamsList.length > 0 ? (
                                upcomingExamsList.map((exam) => {
                                    const examDate = new Date(exam.date);
                                    const diff = Math.ceil(
                                        (examDate.getTime() - today.getTime()) /
                                            (1000 * 60 * 60 * 24),
                                    );

                                    return (
                                        <div
                                            key={exam.id}
                                            className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                            <div className="min-w-0 pr-2">
                                                <p className="text-xs font-bold truncate leading-tight">
                                                    {exam.subject}
                                                </p>
                                                <p className="text-[10px] text-stone-400 pt-0.5">
                                                    {examDate.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${diff <= 3 ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700"}`}>
                                                {diff < 0
                                                    ? "Done"
                                                    : diff === 0
                                                      ? "Today"
                                                      : `${diff}d left`}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 space-y-3">
                                    <p className="text-xs text-stone-400 leading-relaxed">
                                        No academic exams mapped. Stay ahead of
                                        your deadlines by logging your next
                                        major test.
                                    </p>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-8 text-xs border-stone-200 dark:border-stone-800">
                                        <Link href="/exams">Track Exams ➔</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
