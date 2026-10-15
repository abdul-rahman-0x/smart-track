import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, exams, habitCompletions, habits } from "@/db/schema";
import { eq, and, asc, desc, gte, lte } from "drizzle-orm";
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
    Sparkles,
    Calendar,
    Circle,
    LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) redirect("/login");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [upcomingExams, allTodayTasks, userHabits, todayCompletions] =
        await Promise.all([
            db.query.exams.findMany({
                where: and(eq(exams.userId, userId), gte(exams.date, today)),
                orderBy: [asc(exams.date)],
                limit: 2,
            }),
            db
                .select()
                .from(tasks)
                .where(
                    and(
                        eq(tasks.userId, userId),
                        gte(tasks.dueDate, today),
                        lte(tasks.dueDate, endOfDay),
                    ),
                ),
            db.query.habits.findMany({
                where: eq(habits.userId, userId),
                orderBy: [desc(habits.streak)],
                limit: 4,
            }),
            db
                .select()
                .from(habitCompletions)
                .where(
                    and(
                        gte(habitCompletions.completedAt, today),
                        lte(habitCompletions.completedAt, endOfDay),
                    ),
                ),
        ]);

    const completedTasksCount = allTodayTasks.filter((t) => t.completed).length;
    const activeTasks = allTodayTasks.filter((t) => !t.completed);
    const taskCompletionRate =
        allTodayTasks.length > 0
            ? Math.round((completedTasksCount / allTodayTasks.length) * 100)
            : 0;

    const completedHabitsCount = userHabits.filter((h) =>
        todayCompletions.some((c) => c.habitId === h.id),
    ).length;
    const habitCompletionRate =
        userHabits.length > 0
            ? Math.round((completedHabitsCount / userHabits.length) * 100)
            : 0;

    const nextExam = upcomingExams[0];
    const daysToExam = nextExam
        ? Math.ceil(
              (new Date(nextExam.date).getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24),
          )
        : null;

    const firstName = session?.user?.name?.split(" ")[0] || "User";

    return (
        <div className="relative min-h-screen">
            {/* Subtle atmospheric ambient glow to kill the flat black void */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-emerald-500/[0.04] blur-3xl pointer-events-none rounded-full" />

            <div className="relative space-y-8 pb-16">
                {/* Header: Personalized Greeting & Quick Actions */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                                Welcome back, {firstName}
                            </h1>

                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Here is what needs your attention today.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-lg border border-border/60">
                            <Calendar className="size-3.5 text-muted-foreground/80" />
                            {format(today, "EEEE, MMMM do")}
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="btn-tactile bg-foreground text-background font-medium hover:bg-foreground/90 h-8.5 px-3.5 text-xs shadow-xs">
                            <Link href="/planner">
                                <Plus className="size-3.5 mr-1.5" />
                                New Task
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Metric Bento Cards (Larger, Substantial, with Progress Indicators) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        label="Daily Tasks"
                        value={`${taskCompletionRate}%`}
                        subtext={`${completedTasksCount} of ${allTodayTasks.length} tasks finished`}
                        progress={taskCompletionRate}
                        icon={Target}
                        accent="emerald"
                    />
                    <MetricCard
                        label="Habit Streaks"
                        value={`${habitCompletionRate}%`}
                        subtext={`${completedHabitsCount} of ${userHabits.length} routines logged`}
                        progress={habitCompletionRate}
                        icon={Flame}
                        accent="amber"
                    />
                    <MetricCard
                        label="Focus Session"
                        value="Deep Work"
                        subtext="Ready for a 25m sprint"
                        icon={Timer}
                        accent="indigo"
                        href="/focus"
                    />
                    <MetricCard
                        label="Next Milestone"
                        value={daysToExam !== null ? `${daysToExam}d left` : "Clear"}
                        subtext={nextExam ? nextExam.subject : "No upcoming exams"}
                        icon={GraduationCap}
                        accent="rose"
                        href="/exams"
                    />
                </div>

                {/* 2-Column Command Center (65% / 35%) */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Today's Agenda & Deep Work Launcher */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Agenda Card */}
                        <div className="rounded-xl border border-border/90 bg-card p-5 sm:p-6 card-elevation space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                        <ListTodo className="size-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-foreground leading-tight">
                                            Today&apos;s Focus Queue
                                        </h2>
                                        <span className="text-xs text-muted-foreground">
                                            {activeTasks.length} active {activeTasks.length === 1 ? "task" : "tasks"} scheduled
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                                    <Link href="/planner" className="flex items-center gap-1 group">
                                        Open Planner
                                        <ArrowRight className="size-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            {activeTasks.length > 0 ? (
                                <div className="space-y-2 pt-1">
                                    {activeTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="size-4.5 rounded-full border border-muted-foreground/40 flex items-center justify-center group-hover:border-emerald-500 transition-colors shrink-0">
                                                    <Circle className="size-2 text-transparent group-hover:text-emerald-500 group-hover:fill-emerald-500 transition-all" />
                                                </div>
                                                <span className="text-sm font-medium text-foreground/90 truncate">
                                                    {task.title.replace(/\[.*?\]/g, "").trim()}
                                                </span>
                                            </div>
                                            {task.priority && (
                                                <span
                                                    className={cn(
                                                        "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ml-3",
                                                        task.priority.toLowerCase() === "high"
                                                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                            : task.priority.toLowerCase() === "medium"
                                                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                              : "bg-muted text-muted-foreground border border-border/60",
                                                    )}>
                                                    {task.priority.toLowerCase()}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-lg bg-secondary/20 border border-dashed border-border/70">
                                    <div className="size-11 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        All tasks completed for today
                                    </h3>
                                    <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-relaxed">
                                        Your queue is clean. Structure tomorrow&apos;s schedule in the Smart Planner or start a dedicated Deep Work timer.
                                    </p>
                                    <div className="flex items-center gap-2.5">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs font-medium border-border hover:bg-accent">
                                            <Link href="/planner">
                                                <Plus className="size-3 mr-1" />
                                                Plan a Task
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="btn-tactile h-8 text-xs font-medium bg-foreground text-background hover:bg-foreground/90">
                                            <Link href="/focus">
                                                <Play className="size-3 mr-1 fill-current" />
                                                Focus Sprint
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Deep Work Focus Quick Launcher Banner */}
                        <div className="rounded-xl border border-border/90 bg-gradient-to-r from-card via-card to-secondary/30 p-5 card-elevation flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                    <Timer className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                        Deep Work Timer
                                        <Sparkles className="size-3 text-amber-400" />
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Block digital noise and execute focused 25-minute sprints.
                                    </p>
                                </div>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="btn-tactile bg-foreground text-background hover:bg-foreground/90 text-xs font-medium h-8.5 px-4 shrink-0">
                                <Link href="/focus">
                                    <Play className="size-3 mr-1.5 fill-current" />
                                    Start Session
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Daily Habits & Academic Roadmap */}
                    <div className="space-y-6">
                        {/* Daily Habits Widget */}
                        <div className="rounded-xl border border-border/90 bg-card p-5 card-elevation space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="size-7 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <Flame className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-foreground">
                                        Daily Habits
                                    </h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                                    <Link href="/habits" className="flex items-center gap-1 group">
                                        View all
                                        <ArrowRight className="size-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {userHabits.length > 0 ? (
                                    userHabits.map((habit) => {
                                        const isDone = todayCompletions.some(
                                            (c) => c.habitId === habit.id,
                                        );
                                        return (
                                            <div
                                                key={habit.id}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                                                    isDone
                                                        ? "bg-secondary/20 border-border/40"
                                                        : "bg-secondary/40 border-border/80 hover:border-amber-500/40 hover:bg-secondary/60",
                                                )}>
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="text-[11px] font-mono font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                                                        {habit.streak}d
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "text-xs font-medium truncate",
                                                            isDone
                                                                ? "text-muted-foreground line-through decoration-muted-foreground/40"
                                                                : "text-foreground",
                                                        )}>
                                                        {habit.name}
                                                    </span>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "size-5 rounded-md border flex items-center justify-center transition-all shrink-0 ml-2",
                                                        isDone
                                                            ? "bg-amber-500 border-amber-500 text-black font-bold"
                                                            : "bg-card border-border",
                                                    )}>
                                                    {isDone && (
                                                        <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-6 rounded-lg border border-dashed border-border/80 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            No daily habits configured yet.
                                        </p>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs mt-2 border-border">
                                            <Link href="/habits">+ Add Habit</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Academic Roadmap Widget */}
                        <div className="rounded-xl border border-border/90 bg-card p-5 card-elevation space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="size-7 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                        <GraduationCap className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-foreground">
                                        Academic Roadmap
                                    </h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                                    <Link href="/exams" className="flex items-center gap-1 group">
                                        View all
                                        <ArrowRight className="size-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            {nextExam ? (
                                <div className="p-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] space-y-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                                                Next Milestone
                                            </span>
                                            <h4 className="text-sm font-semibold text-foreground mt-0.5 truncate">
                                                {nextExam.subject}
                                            </h4>
                                        </div>
                                        {daysToExam !== null && (
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                                                {daysToExam}d remaining
                                            </span>
                                        )}
                                    </div>
                                    {nextExam.notes && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {nextExam.notes}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-lg bg-secondary/10">
                                    <GraduationCap className="size-5 text-muted-foreground/40 mb-1.5" />
                                    <h4 className="text-xs font-semibold text-foreground">
                                        No upcoming exams
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground mt-1 mb-3 max-w-[200px]">
                                        Track syllabus chapters and test deadlines effortlessly.
                                    </p>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs border-border hover:bg-accent">
                                        <Link href="/exams">+ Plan Exam</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Substantial, Tactile Metric Card Component
const MetricCard = ({
    label,
    value,
    subtext,
    progress,
    icon: Icon,
    accent,
    href,
}: {
    label: string;
    value: string;
    subtext: string;
    progress?: number;
    icon: LucideIcon;
    accent: "emerald" | "amber" | "indigo" | "rose";
    href?: string;
}) => {
    const accentColors = {
        emerald: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-500",
            bar: "bg-emerald-500",
            border: "group-hover:border-emerald-500/40",
        },
        amber: {
            bg: "bg-amber-500/10",
            text: "text-amber-500",
            bar: "bg-amber-500",
            border: "group-hover:border-amber-500/40",
        },
        indigo: {
            bg: "bg-indigo-500/10",
            text: "text-indigo-400",
            bar: "bg-indigo-500",
            border: "group-hover:border-indigo-500/40",
        },
        rose: {
            bg: "bg-rose-500/10",
            text: "text-rose-500",
            bar: "bg-rose-500",
            border: "group-hover:border-rose-500/40",
        },
    }[accent];

    const content = (
        <div
            className={cn(
                "rounded-xl border border-border/90 bg-card p-5 card-elevation flex flex-col justify-between h-full transition-all group",
                accentColors.border,
                href && "hover:-translate-y-0.5 cursor-pointer",
            )}>
            <div className="flex items-start justify-between">
                <div>
                    <span className="text-xs font-medium text-muted-foreground block">
                        {label}
                    </span>
                    <span className="text-2xl font-bold tracking-tight text-foreground mt-1.5 block">
                        {value}
                    </span>
                </div>
                <div
                    className={cn(
                        "size-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105",
                        accentColors.bg,
                        accentColors.text,
                    )}>
                    <Icon className="size-4.5" />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40">
                {progress !== undefined && (
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500", accentColors.bar)}
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    </div>
                )}
                <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {subtext}
                </span>
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
};
