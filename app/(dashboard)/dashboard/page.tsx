import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
    tasks,
    exams,
    syllabusItems,
    habitCompletions,
    habits,
} from "@/db/schema";
import { eq, and, asc, desc, gte, lte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Clock,
    Calendar,
    BookOpen,
    ArrowRight,
    CheckCircle2,
    ListTodo,
    GraduationCap,
    Activity,
    Sparkles,
} from "lucide-react";
import { getSubscriptionPlan } from "@/lib/subscription";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/login");
    }

    // 1. Unified Subscription Check (Replaces manual fetch)
    const { isPro } = await getSubscriptionPlan();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // --- 2. Fetch Next Exam Milestone ---
    const upcomingExamsList = await db.query.exams.findMany({
        where: and(eq(exams.userId, userId), gte(exams.date, today)),
        orderBy: [asc(exams.date)],
        limit: 3,
    });

    const nextExam = upcomingExamsList[0];
    let daysRemaining: number | null = null;
    if (nextExam) {
        const examDate = new Date(nextExam.date);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // --- 3. Fetch Syllabus Progress ---
    const allSyllabusItems = await db
        .select()
        .from(syllabusItems)
        .innerJoin(exams, eq(syllabusItems.examId, exams.id))
        .where(eq(exams.userId, userId));

    const totalSyllabus = allSyllabusItems.length;
    const completedSyllabus = allSyllabusItems.filter(
        (item) => item.syllabus_item.completed,
    ).length;
    const syllabusProgress = totalSyllabus > 0 ? Math.round((completedSyllabus / totalSyllabus) * 100) : 0;

    // --- 4. Focus Session Calculation ---
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

    let totalWeekFocusMinutes = 0;
    weeklyFocusTasks.forEach(() => (totalWeekFocusMinutes += 25));
    const focusHours = (totalWeekFocusMinutes / 60).toFixed(1);

    // --- 5. Today's Tasks ---
    const allTodayTasks = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), gte(tasks.dueDate, today), lte(tasks.dueDate, endOfDay)));

    const focusCount = allTodayTasks.filter((t) => t.completed && t.title === "[FOCUS] 25m Focus Session").length;
    const todayUserTasks = allTodayTasks.filter((t) => !t.title.startsWith("[FOCUS]"));
    const completedTodayTasks = todayUserTasks.filter((t) => t.completed).length;
    const taskProgressPercentage = todayUserTasks.length > 0 ? Math.round((completedTodayTasks / todayUserTasks.length) * 100) : 0;

    // --- 6. Habits ---
    const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
        orderBy: [desc(habits.streak)],
        limit: 4,
    });

    const todayCompletions = await db
        .select()
        .from(habitCompletions)
        .where(and(gte(habitCompletions.completedAt, today), lte(habitCompletions.completedAt, endOfDay)));

    const completedHabitsToday = userHabits.filter((h) => todayCompletions.some((c) => c.habitId === h.id)).length;
    const habitsProgressPercentage = userHabits.length > 0 ? Math.round((completedHabitsToday / userHabits.length) * 100) : 0;

    // --- 7. Progress Ring Circles ---
    const outerCirc = 226;
    const outerOffset = outerCirc - (outerCirc * habitsProgressPercentage) / 100;
    const middleCirc = 176;
    const middleOffset = middleCirc - (middleCirc * taskProgressPercentage) / 100;
    const innerCirc = 125;
    const innerOffset = innerCirc - (innerCirc * syllabusProgress) / 100;

    const displayName = session?.user?.name?.split(" ")[0] || "User";

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header and Plan Status Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 dark:border-stone-800 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                            Welcome back, {displayName}
                        </h2>
                        {isPro ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
                                <Sparkles className="w-3 h-3 fill-current" />
                                PRO MEMBER
                            </span>
                        ) : (
                            <Link
                                href="/billing"
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 border border-stone-200/40 dark:border-stone-800/40"
                            >
                                FREE PLAN • UPGRADE
                            </Link>
                        )}
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                        {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                {/* Focus Card */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none hover:border-orange-500/30 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Focus State</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{focusHours} Hours Focused</div>
                        <p className="text-[10px] text-stone-400">{focusCount >= 2 ? "Daily focus block target achieved! 🧘" : `${focusCount}/2 sessions logged.`}</p>
                    </CardContent>
                </Card>

                {/* Syllabus Card */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none hover:border-emerald-500/30 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Syllabus</CardTitle>
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-2xl font-bold tracking-tight text-emerald-500">{syllabusProgress}% Completed</div>
                        <div className="flex gap-1">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className={`flex-1 h-3 rounded-[1px] ${syllabusProgress >= (i + 1) * 5 ? "bg-emerald-500" : "bg-stone-100 dark:bg-stone-800"}`} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Exam Card */}
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none hover:border-indigo-500/30 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Next Milestone</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        {nextExam ? (
                            <>
                                <div className="text-md font-bold truncate text-stone-900 dark:text-stone-100">{nextExam.subject}</div>
                                <p className="text-xs font-semibold text-rose-500">{daysRemaining === 0 ? "Today" : `${daysRemaining} days left`}</p>
                            </>
                        ) : (
                            <Link href="/exams" className="text-xs font-bold text-stone-400 flex items-center gap-1 hover:underline pt-1">Log exam <ArrowRight className="w-3.5 h-3.5" /></Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Rings Analytics Card */}
            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none p-6 rounded-2xl">
                <div className="grid gap-6 md:grid-cols-5 items-center">
                    <div className="md:col-span-3 space-y-4">
                        <span className="block text-[10px] uppercase font-bold text-stone-400">Work Activity</span>
                        <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">Active progression overview</h3>
                        <div className="grid gap-3 pt-2 text-xs">
                            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-stone-400">Habits: {completedHabitsToday}/{userHabits.length} ({habitsProgressPercentage}%)</span></div>
                            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-indigo-500" /><span className="text-stone-400">Tasks: {completedTodayTasks}/{todayUserTasks.length} ({taskProgressPercentage}%)</span></div>
                            <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-stone-400">Syllabus: {completedSyllabus}/{totalSyllabus} ({syllabusProgress}%)</span></div>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="6" fill="none" />
                                <circle cx="50" cy="50" r="36" className="stroke-orange-500 transition-all duration-500" strokeWidth="6" fill="none" strokeDasharray={outerCirc} strokeDashoffset={outerOffset} strokeLinecap="round" />
                                <circle cx="50" cy="50" r="28" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="6" fill="none" />
                                <circle cx="50" cy="50" r="28" className="stroke-indigo-500 transition-all duration-500" strokeWidth="6" fill="none" strokeDasharray={middleCirc} strokeDashoffset={middleOffset} strokeLinecap="round" />
                                <circle cx="50" cy="50" r="20" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="6" fill="none" />
                                <circle cx="50" cy="50" r="20" className="stroke-emerald-500 transition-all duration-500" strokeWidth="6" fill="none" strokeDasharray={innerCirc} strokeDashoffset={innerOffset} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-stone-400"><Activity size={20} /></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Row 3: Checklist & Timeline */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none p-6 rounded-2xl">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2 mb-4">
                        <ListTodo className="w-4 h-4 text-emerald-500" />
                        <h4 className="font-bold text-sm">Priority Agenda</h4>
                    </div>
                    {todayUserTasks.length > 0 ? todayUserTasks.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 py-3 border-b border-stone-50 dark:border-stone-900 last:border-0">
                            <CheckCircle2 className={`w-4 h-4 ${t.completed ? "text-emerald-500" : "text-stone-300"}`} />
                            <span className={`text-xs ${t.completed ? "line-through text-stone-400" : "text-stone-700 dark:text-stone-300"}`}>{t.title}</span>
                        </div>
                    )) : (
                        <div className="text-center py-10"><p className="text-xs text-stone-400">No tasks today. Reclaim your focus.</p></div>
                    )}
                </Card>
                <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900/60 shadow-none p-6 rounded-2xl">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2 mb-4">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        <h4 className="font-bold text-sm">Exams</h4>
                    </div>
                    {upcomingExamsList.map((e) => (
                        <div key={e.id} className="flex justify-between py-3 border-b border-stone-50 last:border-0">
                            <div className="text-xs font-bold truncate">{e.subject}</div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-400">
                                {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}