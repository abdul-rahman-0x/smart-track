import {
    CalendarClock,
    Check,
    Flame,
    GraduationCap,
    ListTodo,
} from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const features = [
    {
        title: "Habit Streaks",
        description:
            "Build momentum with daily streaks that keep you accountable.",
        icon: Flame,
        preview: (
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Morning routine</span>
                    <span className="font-medium text-foreground">12 days</span>
                </div>
                <div className="flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <span
                            key={index}
                            className={`size-2.5 rounded-full ${
                                index < 5
                                    ? "bg-stone-700 dark:bg-zinc-300"
                                    : "bg-stone-200 dark:bg-zinc-700"
                            }`}
                        />
                    ))}
                </div>
                <p className="text-sm font-medium text-stone-800 dark:text-zinc-200">
                    12 day streak
                </p>
            </div>
        ),
    },
    {
        title: "Task Planner",
        description:
            "Organize assignments and priorities in one calm, focused view.",
        icon: ListTodo,
        preview: (
            <ul className="space-y-2.5">
                {[
                    { label: "Review lecture notes", done: true },
                    { label: "Submit lab report", done: true },
                    { label: "Prepare study guide", done: false },
                ].map((task) => (
                    <li
                        key={task.label}
                        className="flex items-center gap-2.5 text-sm">
                        <span
                            className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                                task.done
                                    ? "border-stone-700 bg-stone-700 text-stone-50 dark:border-zinc-300 dark:bg-zinc-300 dark:text-zinc-900"
                                    : "border-stone-300 dark:border-zinc-600"
                            }`}>
                            {task.done ? (
                                <Check className="size-2.5" strokeWidth={3} />
                            ) : null}
                        </span>
                        <span
                            className={
                                task.done
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground"
                            }>
                            {task.label}
                        </span>
                    </li>
                ))}
            </ul>
        ),
    },
    {
        title: "Exam Milestones",
        description:
            "Track key dates and stay ahead of every deadline that matters.",
        icon: GraduationCap,
        preview: (
            <div className="rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Finals Week
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Computer Science 201
                        </p>
                    </div>
                    <CalendarClock className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-800 dark:text-zinc-100">
                    14{" "}
                    <span className="text-base font-normal text-muted-foreground">
                        days left
                    </span>
                </p>
            </div>
        ),
    },
] as const;

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <BrandMark href="/" size="sm" />
                    <ModeToggle />
                </div>
            </header>

            <main>
                <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-zinc-500">
                            Academic productivity
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                            Master your habits.
                            <span className="mt-2 block text-stone-600 dark:text-zinc-400">
                                Conquer your deadlines.
                            </span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                            A unified workspace for habits, tasks, and exam
                            prep — designed to keep students focused without the
                            noise.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild size="lg" className="min-w-40">
                                <Link href="/dashboard">Get Started</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/login">Sign in</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="border-t border-border bg-stone-50/80 dark:bg-zinc-950/50">
                    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                        <div className="mb-10 max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-zinc-50">
                                Everything you need to stay on track
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Three focused tools that work together — no
                                clutter, no distractions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {features.map(
                                ({ title, description, icon: Icon, preview }) => (
                                    <article
                                        key={title}
                                        className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                                        <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                                            <Icon className="size-4 text-stone-700 dark:text-zinc-300" />
                                        </div>
                                        <h3 className="text-lg font-medium text-stone-900 dark:text-zinc-50">
                                            {title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {description}
                                        </p>
                                        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
                                            {preview}
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    </div>
                </section>

                <section className="border-t border-border">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20">
                        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-zinc-50">
                            Ready to take control of your semester?
                        </h2>
                        <p className="max-w-lg text-muted-foreground">
                            Join smart-track and bring your habits, planner, and
                            exam prep into one calm dashboard.
                        </p>
                        <Button asChild size="lg" className="min-w-44">
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
