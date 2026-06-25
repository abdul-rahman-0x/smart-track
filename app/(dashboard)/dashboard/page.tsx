import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, exams, syllabusItems, habitCompletions, habits } from "@/db/schema";
import { eq, and, asc, desc, gte, lte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, BookOpen, ArrowRight, CheckCircle2, ListTodo, GraduationCap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubscriptionPlan } from "@/lib/subscription";
import { TierBadge } from "@/components/ui/tier-badge";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) redirect("/login");

    const { isPro } = await getSubscriptionPlan();

    // --- DATE LOGIC ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // --- DATA FETCHING ---
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
        daysRemaining = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    const allSyllabusItems = await db.select().from(syllabusItems).innerJoin(exams, eq(syllabusItems.examId, exams.id)).where(eq(exams.userId, userId));
    const syllabusProgress = allSyllabusItems.length > 0 ? Math.round((allSyllabusItems.filter(i => i.syllabus_item.completed).length / allSyllabusItems.length) * 100) : 0;

    const allTodayTasks = await db.select().from(tasks).where(and(eq(tasks.userId, userId), gte(tasks.dueDate, today), lte(tasks.dueDate, endOfDay)));
    const todayUserTasks = allTodayTasks.filter(t => !t.title.startsWith("[FOCUS]"));
    const taskProgressPercentage = todayUserTasks.length > 0 ? Math.round((todayUserTasks.filter(t => t.completed).length / todayUserTasks.length) * 100) : 0;

    const userHabits = await db.query.habits.findMany({ where: eq(habits.userId, userId), orderBy: [desc(habits.streak)], limit: 4 });
    const todayCompletions = await db.select().from(habitCompletions).where(and(gte(habitCompletions.completedAt, today), lte(habitCompletions.completedAt, endOfDay)));
    const habitsProgressPercentage = userHabits.length > 0 ? Math.round((userHabits.filter(h => todayCompletions.some(c => c.habitId === h.id)).length / userHabits.length) * 100) : 0;

    // --- SHARED UI CLASSES (Task 2: Elevated Depth) ---
    const cardStyles = "border border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-900/50 ring-1 ring-black/5 dark:ring-white/5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 shadow-md";

    const displayName = session?.user?.name?.split(" ")[0] || "User";

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 dark:border-stone-800 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                            Welcome back, {displayName}
                        </h2>
                        <TierBadge isPro={isPro} />
                    </div>
                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                        {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400">Focus State</CardTitle>
                        <div className="p-1.5 rounded-lg bg-orange-500/10"><Clock className="h-4 w-4 text-orange-500" /></div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">0.0 Hours Focused</div>
                        <p className="text-[10px] font-medium text-stone-400 mt-1 italic">Consistency is the key to mastery.</p>
                    </CardContent>
                </Card>

                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400">Syllabus Progress</CardTitle>
                        <div className="p-1.5 rounded-lg bg-emerald-500/10"><BookOpen className="h-4 w-4 text-emerald-500" /></div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="text-2xl font-bold text-emerald-500">{syllabusProgress}%</div>
                        <div className="flex gap-1">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-700 ${syllabusProgress >= (i + 1) * 6.6 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-stone-100 dark:bg-stone-800"}`} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className={cardStyles}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400">Next Milestone</CardTitle>
                        <div className="p-1.5 rounded-lg bg-indigo-500/10"><Calendar className="h-4 w-4 text-indigo-500" /></div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        {nextExam ? (
                            <div className="space-y-1">
                                <div className="text-md font-bold truncate text-stone-900 dark:text-stone-100">{nextExam.subject}</div>
                                <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wide">{daysRemaining === 0 ? "Due Today" : `${daysRemaining}d remaining`}</p>
                            </div>
                        ) : (
                            <Link href="/exams" className="text-xs font-bold text-stone-400 flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors pt-1">Setup your first exam <ArrowRight className="w-3.5 h-3.5" /></Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Work Activity Section */}
            <Card className={cn(cardStyles, "p-8 rounded-[2rem]")}>
                <div className="grid gap-12 md:grid-cols-5 items-center">
                    <div className="md:col-span-3 space-y-6">
                        <div className="space-y-2">
                            <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">Analytics</h4>
                            <h3 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">Continuous progression flow</h3>
                        </div>
                        <div className="grid gap-4 pt-2">
                            <ActivityItem color="bg-orange-500" label="Habit Streaks" value={`${habitsProgressPercentage}%`} />
                            <ActivityItem color="bg-indigo-500" label="Planner Tasks" value={`${taskProgressPercentage}%`} />
                            <ActivityItem color="bg-emerald-500" label="Syllabus chapters" value={`${syllabusProgress}%`} />
                        </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                        <div className="relative w-48 h-48">
                            {/* Circles remain same, but the parent has higher shadow depth */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="38" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="5" fill="none" />
                                <circle cx="50" cy="50" r="38" className="stroke-orange-500 transition-all duration-1000" strokeWidth="5" fill="none" strokeDasharray="238" strokeDashoffset={238 - (238 * habitsProgressPercentage) / 100} strokeLinecap="round" />
                                <circle cx="50" cy="50" r="30" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="5" fill="none" />
                                <circle cx="50" cy="50" r="30" className="stroke-indigo-500 transition-all duration-1000 delay-100" strokeWidth="5" fill="none" strokeDasharray="188" strokeDashoffset={188 - (188 * taskProgressPercentage) / 100} strokeLinecap="round" />
                                <circle cx="50" cy="50" r="22" className="stroke-stone-100 dark:stroke-stone-800" strokeWidth="5" fill="none" />
                                <circle cx="50" cy="50" r="22" className="stroke-emerald-500 transition-all duration-1000 delay-200" strokeWidth="5" fill="none" strokeDasharray="138" strokeDashoffset={138 - (138 * syllabusProgress) / 100} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-700 opacity-40"><Activity size={24} /></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bottom Row: Priority and Timeline */}
            <div className="grid gap-6 md:grid-cols-3 pb-12 items-start">
                {/* 1. Priority Agenda Card */}
                <Card className={cn(cardStyles, "md:col-span-2 p-6 rounded-3xl flex flex-col h-[300px] overflow-hidden")}>
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 mb-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <ListTodo className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-sans font-bold text-[10px] uppercase tracking-[0.15em] text-stone-400">Priority Agenda</h4>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-6 px-2 text-[9px] font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors"
                        >
                            <Link href="/planner">View All</Link>
                        </Button>
                    </div>

                    <div className="overflow-y-auto pr-2 custom-scrollbar scroll-mask flex-1 py-4">
                        <div className="space-y-1">
                            {todayUserTasks.length > 0 ? todayUserTasks.map((t) => (
                                <div key={t.id} className="flex items-start gap-3 py-2.5 px-2 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                                    <CheckCircle2 className={cn(
                                        "w-4 h-4 mt-0.5 shrink-0 transition-all",
                                        t.completed ? "text-emerald-500" : "text-stone-200 dark:text-stone-800 group-hover:text-stone-300"
                                    )} />
                                    <span className={cn(
                                        "text-xs font-medium transition-all line-clamp-1 leading-snug",
                                        t.completed ? "line-through text-stone-400" : "text-stone-700 dark:text-stone-300"
                                    )}>
                                        {t.title}
                                    </span>
                                </div>
                            )) : (
                                <div className="h-full flex items-center justify-center py-12">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 dark:text-stone-700">Empty Agenda</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* 2. Upcoming Exams Card - Now with View All Button */}
                <Card className={cn(cardStyles, "p-6 rounded-3xl flex flex-col h-[300px] overflow-hidden")}>
                    <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 mb-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-sans font-bold text-[10px] uppercase tracking-[0.15em] text-stone-400">Upcoming Exams</h4>
                        </div>
                        {/* Added: Symmetric Navigation Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-6 px-2 text-[9px] font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors"
                        >
                            <Link href="/exams">View All</Link>
                        </Button>
                    </div>

                    <div className="overflow-y-auto pr-2 custom-scrollbar scroll-mask flex-1 py-4">
                        <div className="space-y-2">
                            {upcomingExamsList.length > 0 ? upcomingExamsList.map((e) => (
                                <div
                                    key={e.id}
                                    className={cn(
                                        "flex flex-col gap-1 p-3 rounded-xl transition-all duration-200 shrink-0",
                                        "bg-stone-100/40 dark:bg-stone-900/60",
                                        "border border-stone-200/50 dark:border-stone-800/50",
                                        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
                                        "hover:bg-stone-100/60 dark:hover:bg-stone-800/80 hover:shadow-none"
                                    )}
                                >
                                    <div className="text-[11px] font-bold truncate text-stone-900 dark:text-stone-100 line-clamp-1">
                                        {e.subject}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 uppercase">
                                            {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex items-center justify-center py-12">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 dark:text-stone-700">No Exams</p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// Sub-component for clean mapping
const ActivityItem = ({ color, label, value }: { color: string; label: string; value: string }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <span className="font-bold text-[12px] text-stone-500 dark:text-stone-400 transition-colors tracking-[0.10em]">{label}</span>
        </div>
        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{value}</span>
    </div>
);