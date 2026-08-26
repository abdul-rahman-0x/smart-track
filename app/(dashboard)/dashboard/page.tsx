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
    Zap,
    Timer,
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
                limit: 3,
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

    const activeTasks = allTodayTasks.filter((t) => !t.completed);
    const taskCompletionRate =
        allTodayTasks.length > 0
            ? Math.round(
                  (allTodayTasks.filter((t) => t.completed).length /
                      allTodayTasks.length) *
                      100,
              )
            : 0;

    const habitCompletionRate =
        userHabits.length > 0
            ? Math.round(
                  (userHabits.filter((h) =>
                      todayCompletions.some((c) => c.habitId === h.id),
                  ).length /
                      userHabits.length) *
                      100,
              )
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
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 md:px-8 pt-6">
            <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Here is your overview for today.
                    </p>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3.5 py-1.5 rounded-full border border-border/60 w-fit">
                    {format(today, "EEEE, MMMM do")}
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Task Completion"
                    value={`${taskCompletionRate}%`}
                    icon={Target}
                    color="text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                    label="Habit Progress"
                    value={`${habitCompletionRate}%`}
                    icon={Flame}
                    color="text-amber-600 dark:text-amber-400"
                />
                <MetricCard
                    label="Focus Time"
                    value="Not tracked"
                    icon={Timer}
                    color="text-zinc-500"
                />
                <MetricCard
                    label="Days to Exam"
                    value={daysToExam !== null ? `${daysToExam}d` : "None"}
                    icon={GraduationCap}
                    color="text-rose-600 dark:text-rose-400"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-10 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <SectionHeader
                        title="Today's Agenda"
                        icon={ListTodo}
                        href="/planner"
                    />
                    <div className="border border-border bg-card rounded-lg overflow-hidden shadow-xs">
                        {activeTasks.length > 0 ? (
                            <div className="divide-y divide-border/60">
                                {activeTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                                        <div className="size-4 rounded-full border border-muted-foreground/30 flex items-center justify-center text-transparent group-hover:border-primary/50 group-hover:text-primary/30 transition-all">
                                            <span className="size-1.5 rounded-full bg-foreground/15 group-hover:bg-primary transition-colors" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground/90 flex-1">
                                            {task.title
                                                .replace(/\[.*?\]/g, "")
                                                .trim()}
                                        </span>
                                        {task.priority && (
                                            <span
                                                className={cn(
                                                    "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                    task.priority.toLowerCase() ===
                                                        "high"
                                                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                        : task.priority.toLowerCase() ===
                                                            "medium"
                                                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                          : "bg-muted text-muted-foreground",
                                                )}>
                                                {task.priority.toLowerCase()}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 mb-3">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <h3 className="text-sm font-medium text-foreground">
                                    All caught up for today
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                                    Your priorities are clear. Stay focused on
                                    your routines and upcoming goals.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <SectionHeader
                            title="Daily Habits"
                            icon={Zap}
                            href="/habits"
                        />
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
                                                "flex items-center justify-between p-3.5 rounded-lg border transition-colors",
                                                isDone
                                                    ? "bg-muted/30 border-border/50"
                                                    : "bg-card border-border hover:border-amber-500/30",
                                            )}>
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xs text-muted-foreground/60 font-mono tracking-tight">
                                                    {habit.streak}d
                                                </span>
                                                <span
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        isDone
                                                            ? "text-muted-foreground/70 line-through decoration-muted-foreground/30"
                                                            : "text-foreground/90",
                                                    )}>
                                                    {habit.name}
                                                </span>
                                            </div>
                                            <div
                                                className={cn(
                                                    "size-5 rounded-md border flex items-center justify-center transition-all",
                                                    isDone
                                                        ? "bg-amber-500 border-amber-500 text-white"
                                                        : "bg-background border-border",
                                                )}>
                                                {isDone && (
                                                    <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 rounded-lg border border-dashed border-border text-center">
                                    <p className="text-xs text-muted-foreground">
                                        No habits tracked yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SectionHeader
                            title="Academic Roadmap"
                            icon={GraduationCap}
                            href="/exams"
                        />
                        {nextExam ? (
                            <div className="p-4 rounded-lg border border-rose-500/10 bg-rose-500/5 space-y-3 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GraduationCap size={48} />
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                            Upcoming Exam
                                        </span>
                                        <h4 className="text-sm font-semibold text-foreground mt-0.5">
                                            {nextExam.subject}
                                        </h4>
                                    </div>
                                    {daysToExam !== null && (
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                            {daysToExam}{" "}
                                            {daysToExam === 1 ? "day" : "days"}{" "}
                                            left
                                        </span>
                                    )}
                                </div>
                                {nextExam.notes && (
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {nextExam.notes}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-lg bg-muted/5">
                                <GraduationCap className="size-5 text-muted-foreground/40 mb-2" />
                                <h4 className="text-xs font-medium text-foreground">
                                    No upcoming exams
                                </h4>
                                <p className="text-[11px] text-muted-foreground mt-1 max-w-50">
                                    Keep your study schedule updated by planning
                                    your next exams.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const MetricCard = ({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
}) => (
    <div className="rounded-lg border border-border bg-card p-4 flex items-start justify-between shadow-xs hover:border-border/80 transition-colors">
        <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground block">
                {label}
            </span>
            <span className="text-2xl font-semibold tracking-tight text-foreground block">
                {value}
            </span>
        </div>
        <Icon className={cn("size-4 mt-1", color)} />
    </div>
);

const SectionHeader = ({
    title,
    icon: Icon,
    href,
}: {
    title: string;
    icon: LucideIcon;
    href: string;
}) => (
    <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
            <Link href={href} className="flex items-center gap-1">
                View all{" "}
                <ArrowRight
                    size={12}
                    className="opacity-70 group-hover:translate-x-0.5 transition-transform"
                />
            </Link>
        </Button>
    </div>
);
