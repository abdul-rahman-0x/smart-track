import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, exams, habitCompletions, habits } from "@/db/schema";
import { eq, and, asc, desc, gte, lte, inArray, or } from "drizzle-orm";
import {
    ArrowRight,
    CheckCircle2,
    ListTodo,
    GraduationCap,
    Flame,
    Target,
    Timer,
    Plus,
    Play,
    Calendar,
    Circle,
    LucideIcon,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays, startOfDay, endOfDay, isBefore } from "date-fns";

function cleanTaskTitle(title: string): string {
    return title.replace(/\[.*?\]/g, "").trim();
}

interface MetricCardProps {
    label: string;
    value: string;
    subtext: string;
    progress?: number;
    icon: LucideIcon;
    badge?: string;
    href?: string;
}

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) redirect("/login");

    const now = new Date();
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);

    // 1. Fetch habits first to safely bound completion queries
    const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
        orderBy: [desc(habits.streak)],
    });

    const userHabitIds = userHabits.map((h) => h.id);

    // 2. Query data: includes today's tasks PLUS incomplete overdue tasks
    const [upcomingExams, allRelevantTasks, todayCompletions] = await Promise.all([
        db.query.exams.findMany({
            where: and(eq(exams.userId, userId), gte(exams.date, dayStart)),
            orderBy: [asc(exams.date)],
            limit: 2,
        }),
        db
            .select()
            .from(tasks)
            .where(
                and(
                    eq(tasks.userId, userId),
                    or(
                        and(gte(tasks.dueDate, dayStart), lte(tasks.dueDate, dayEnd)),
                        and(eq(tasks.completed, false), lte(tasks.dueDate, dayStart))
                    )
                )
            ),
        userHabitIds.length > 0
            ? db
                .select()
                .from(habitCompletions)
                .where(
                    and(
                        inArray(habitCompletions.habitId, userHabitIds),
                        gte(habitCompletions.completedAt, dayStart),
                        lte(habitCompletions.completedAt, dayEnd)
                    )
                )
            : Promise.resolve([]),
    ]);

    // Task metrics
    const completedTasks = allRelevantTasks.filter((t) => t.completed);
    const activeTasks = allRelevantTasks.filter((t) => !t.completed);
    const taskCompletionRate =
        allRelevantTasks.length > 0
            ? Math.round((completedTasks.length / allRelevantTasks.length) * 100)
            : 0;

    // Habit metrics
    const completedHabitIds = new Set(todayCompletions.map((c) => c.habitId));
    const completedHabitsCount = userHabits.filter((h) =>
        completedHabitIds.has(h.id)
    ).length;
    const habitCompletionRate =
        userHabits.length > 0
            ? Math.round((completedHabitsCount / userHabits.length) * 100)
            : 0;
    const displayedHabits = userHabits.slice(0, 4);
    const bestStreak = Math.max(0, ...userHabits.map((h) => h.streak));

    // Next Exam Countdown
    const nextExam = upcomingExams[0];
    let daysToExamText = "None scheduled";
    if (nextExam) {
        const diff = differenceInCalendarDays(new Date(nextExam.date), now);
        if (diff === 0) daysToExamText = "Today";
        else if (diff === 1) daysToExamText = "Tomorrow";
        else daysToExamText = `${diff} days left`;
    }

    const firstName = session?.user?.name?.split(" ")[0] || "there";

    return (
        <div className="space-y-8 pb-16 max-w-7xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1.5">
                    <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        {activeTasks.length === 0
                            ? "All caught up. Ready to plan ahead or start a focus session?"
                            : `You have ${activeTasks.length} ${activeTasks.length === 1 ? "task" : "tasks"
                            } to focus on today.`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#F9F8F6]/60 bg-[#161616] px-3.5 py-2 rounded-[8px] border border-[#F9F8F6]/[0.08]">
                        <Calendar className="size-3.5 text-[#F9F8F6]/40" />
                        {format(now, "EEEE, MMMM do")}
                    </div>

                    <Button
                        asChild
                        size="sm"
                        className="bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] font-sans font-medium h-9 px-4 rounded-[8px] text-xs transition-colors shadow-none"
                    >
                        <Link href="/planner">
                            <Plus className="size-3.5 mr-1.5 stroke-[2.5]" />
                            Add Task
                        </Link>
                    </Button>
                </div>
            </header>

            {/* 4-Card Macro Bento */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Today's Tasks"
                    value={`${taskCompletionRate}%`}
                    subtext={`${completedTasks.length} of ${allRelevantTasks.length} completed`}
                    progress={taskCompletionRate}
                    icon={Target}
                    href="/planner"
                />

                <MetricCard
                    label="Habits Done"
                    value={`${completedHabitsCount}/${userHabits.length}`}
                    subtext={bestStreak > 0 ? `Best streak: ${bestStreak} days` : "Start your streak"}
                    progress={habitCompletionRate}
                    icon={Flame}
                    badge={bestStreak > 0 ? `${bestStreak}d streak` : undefined}
                    href="/habits"
                />

                <MetricCard
                    label="Next Deadline"
                    value={daysToExamText}
                    subtext={nextExam ? nextExam.subject : "No upcoming exams"}
                    icon={GraduationCap}
                    href="/exams"
                />

                <MetricCard
                    label="Focus Mode"
                    value="25 Mins"
                    subtext="Ready for a sprint"
                    icon={Timer}
                    badge="Ready"
                    href="/focus"
                />
            </section>

            {/* Main Workspace: 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column: Today's Tasks & Focus Session Launcher */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Tasks Card */}
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-6 space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-[#F9F8F6]/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-[8px] bg-[#20201F] text-[#F9F8F6] flex items-center justify-center border border-[#F9F8F6]/[0.08]">
                                    <ListTodo className="size-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-[#F9F8F6]">
                                        Today&apos;s Priority Tasks
                                    </h2>
                                    <span className="text-xs text-[#F9F8F6]/60">
                                        {activeTasks.length} remaining
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 px-2.5 text-xs text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                            >
                                <Link href="/planner" className="flex items-center gap-1.5 group">
                                    Open Planner
                                    <ArrowRight className="size-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        {/* Task List */}
                        {activeTasks.length > 0 ? (
                            <div className="space-y-2">
                                {activeTasks.map((task) => {
                                    const isOverdue =
                                        task.dueDate && isBefore(new Date(task.dueDate), dayStart);

                                    return (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#F9F8F6]/[0.06] bg-[#0E0D0C]/40 hover:bg-[#20201F]/60 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="size-4 rounded-[4px] border border-[#F9F8F6]/20 flex items-center justify-center group-hover:border-[#F9F8F6]/60 transition-colors shrink-0">
                                                    <Circle className="size-1.5 text-transparent group-hover:text-[#F9F8F6]/80 fill-current" />
                                                </div>
                                                <span className="text-sm font-sans text-[#F9F8F6]/90 truncate">
                                                    {cleanTaskTitle(task.title)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0 ml-3">
                                                {isOverdue && (
                                                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-[#B42318]/15 text-[#F87171] border border-[#B42318]/30 flex items-center gap-1">
                                                        <AlertCircle className="size-2.5" />
                                                        Overdue
                                                    </span>
                                                )}
                                                {task.priority && task.priority.toLowerCase() === "high" && (
                                                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20">
                                                        High
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-[8px] bg-[#0E0D0C]/20 border border-[#F9F8F6]/[0.04]">
                                <div className="size-10 rounded-[8px] bg-[#20201F] text-[#66CC63] flex items-center justify-center mb-3 border border-[#F9F8F6]/[0.08]">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <h3 className="text-sm font-medium text-[#F9F8F6]">
                                    All clear for today
                                </h3>
                                <p className="text-xs text-[#F9F8F6]/60 max-w-sm mt-1 mb-5 leading-relaxed">
                                    You have completed every scheduled task. Plan tomorrow&apos;s goals or launch a deep work sprint.
                                </p>
                                <div className="flex items-center gap-2.5">
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-xs border-[#F9F8F6]/[0.12] bg-transparent text-[#F9F8F6] hover:bg-[#20201F] rounded-[8px]"
                                    >
                                        <Link href="/planner">
                                            <Plus className="size-3 mr-1" />
                                            Plan a Task
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-8 text-xs font-medium bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] rounded-[8px]"
                                    >
                                        <Link href="/focus">
                                            <Play className="size-3 mr-1 fill-current" />
                                            Start 25m Timer
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Focus Session Launcher */}
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="size-10 rounded-[8px] bg-[#20201F] text-[#F9F8F6] flex items-center justify-center shrink-0 border border-[#F9F8F6]/[0.08]">
                                <Timer className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#F9F8F6]">
                                    Need 25 minutes of deep focus?
                                </h3>
                                <p className="text-xs text-[#F9F8F6]/60 mt-0.5">
                                    Mute distractions and work on one task until the chime sounds.
                                </p>
                            </div>
                        </div>

                        <Button
                            asChild
                            size="sm"
                            className="bg-[#20201F] hover:bg-[#2A2A29] text-[#F9F8F6] border border-[#F9F8F6]/[0.1] text-xs font-medium h-9 px-4 rounded-[8px] shrink-0 transition-colors"
                        >
                            <Link href="/focus">
                                <Play className="size-3 mr-1.5 fill-current" />
                                Start Focus Mode
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Column: Daily Habits & Upcoming Exams */}
                <div className="space-y-6">
                    {/* Daily Habits Module */}
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F9F8F6]/[0.06]">
                            <div className="flex items-center gap-2">
                                <Flame className="size-4 text-[#F9F8F6]/80" />
                                <h2 className="text-sm font-medium text-[#F9F8F6]">
                                    Daily Habits
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-7 px-2 text-xs text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                            >
                                <Link href="/habits" className="flex items-center gap-1 group">
                                    Open Habits
                                    <ArrowRight className="size-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {displayedHabits.length > 0 ? (
                                displayedHabits.map((habit) => {
                                    const isDone = completedHabitIds.has(habit.id);
                                    return (
                                        <div
                                            key={habit.id}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-[8px] border transition-colors",
                                                isDone
                                                    ? "bg-[#0E0D0C]/20 border-[#F9F8F6]/[0.04]"
                                                    : "bg-[#20201F]/40 border-[#F9F8F6]/[0.08]"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="text-[11px] font-mono text-[#F9F8F6]/80 bg-[#20201F] px-1.5 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08] shrink-0">
                                                    {habit.streak}d
                                                </span>
                                                <span
                                                    className={cn(
                                                        "text-xs truncate",
                                                        isDone
                                                            ? "text-[#F9F8F6]/40 line-through"
                                                            : "text-[#F9F8F6]/90 font-medium"
                                                    )}
                                                >
                                                    {habit.name}
                                                </span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "size-5 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ml-2",
                                                    isDone
                                                        ? "bg-[#66CC63] border-[#66CC63] text-[#0E0D0C]"
                                                        : "bg-[#161616] border-[#F9F8F6]/20"
                                                )}
                                            >
                                                {isDone && <CheckCircle2 className="size-3.5 stroke-[2.5]" />}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 rounded-[8px] border border-dashed border-[#F9F8F6]/[0.08] text-center">
                                    <p className="text-xs text-[#F9F8F6]/60">
                                        No habits created yet.
                                    </p>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs mt-3 border-[#F9F8F6]/[0.12] bg-transparent text-[#F9F8F6] hover:bg-[#20201F] rounded-[6px]"
                                    >
                                        <Link href="/habits">+ Add Habit</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Exams Module */}
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#F9F8F6]/[0.06]">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="size-4 text-[#F9F8F6]/80" />
                                <h2 className="text-sm font-medium text-[#F9F8F6]">
                                    Upcoming Exams
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-7 px-2 text-xs text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                            >
                                <Link href="/exams" className="flex items-center gap-1 group">
                                    View all
                                    <ArrowRight className="size-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        {nextExam ? (
                            <div className="p-4 rounded-[8px] border border-[#F9F8F6]/[0.08] bg-[#20201F]/40 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9F8F6]/60">
                                            Next Test
                                        </span>
                                        <h4 className="text-sm font-medium text-[#F9F8F6] mt-0.5 truncate">
                                            {nextExam.subject}
                                        </h4>
                                    </div>
                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#20201F] text-[#F9F8F6]/80 border border-[#F9F8F6]/[0.08] shrink-0">
                                        {daysToExamText}
                                    </span>
                                </div>
                                {nextExam.notes && (
                                    <p className="text-xs text-[#F9F8F6]/60 line-clamp-2 leading-relaxed">
                                        {nextExam.notes}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#F9F8F6]/[0.08] rounded-[8px]">
                                <GraduationCap className="size-5 text-[#F9F8F6]/20 mb-2" />
                                <h4 className="text-xs font-medium text-[#F9F8F6]">
                                    No upcoming exams
                                </h4>
                                <p className="text-[11px] text-[#F9F8F6]/60 mt-1 mb-3">
                                    Add tests and syllabus chapters to pace your study.
                                </p>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-[#F9F8F6]/[0.12] bg-transparent text-[#F9F8F6] hover:bg-[#20201F] rounded-[6px]"
                                >
                                    <Link href="/exams">+ Plan Exam</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    label,
    value,
    subtext,
    progress,
    icon: Icon,
    badge,
    href,
}: MetricCardProps) {
    const content = (
        <div
            className={cn(
                "rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 flex flex-col justify-between h-full transition-colors",
                href && "hover:border-[#F9F8F6]/20 cursor-pointer"
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-xs font-sans text-[#F9F8F6]/60 block tracking-[-0.01em]">
                        {label}
                    </span>
                    <span className="text-2xl font-mono font-medium tracking-tight text-[#F9F8F6] mt-1.5 block">
                        {value}
                    </span>
                </div>
                <div className="size-8 rounded-[8px] bg-[#20201F] border border-[#F9F8F6]/[0.08] text-[#F9F8F6]/80 flex items-center justify-center shrink-0">
                    <Icon className="size-4" />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F9F8F6]/[0.06]">
                {progress !== undefined && (
                    <div className="w-full bg-[#20201F] h-1 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full rounded-full bg-[#F9F8F6]/80 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#F9F8F6]/60 truncate">{subtext}</span>
                    {badge && (
                        <span className="text-[10px] font-mono text-[#66CC63] bg-[#66CC63]/10 px-1.5 py-0.5 rounded-[4px] border border-[#66CC63]/20">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}
