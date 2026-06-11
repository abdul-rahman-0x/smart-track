import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createHabit, completeHabit } from "./actions";
import { Flame, Check, Plus } from "lucide-react";

export default async function HabitsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    // Load habits from Postgres
    const userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
        orderBy: [desc(habits.createdAt)],
    });

    // Action helper for new habits
    async function handleAddHabit(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        if (!name || name.trim() === "") return;
        await createHabit(name);
    }

    // Helper to check if a habit was completed today
    const isCompletedToday = (lastCompleted: Date | null) => {
        if (!lastCompleted) return false;
        const today = new Date();
        const lastDate = new Date(lastCompleted);
        return (
            today.getDate() === lastDate.getDate() &&
            today.getMonth() === lastDate.getMonth() &&
            today.getFullYear() === lastDate.getFullYear()
        );
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Habit Tracker
                </h2>
                <p className="text-stone-500 dark:text-stone-400">
                    Build consistency. Maintain daily streaks for study blocks
                    and wellness.
                </p>
            </div>

            <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                <CardContent className="pt-6">
                    <form action={handleAddHabit} className="flex gap-3">
                        <Input
                            name="name"
                            placeholder="Enter a new habit (e.g., Code for 1 hour, Read 20 pages...)"
                            required
                            className="flex-1 bg-stone-50 dark:bg-stone-950"
                        />
                        <Button type="submit" className="flex gap-2">
                            <Plus className="w-4 h-4" /> Add Habit
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {userHabits.length > 0 ? (
                    userHabits.map((habit) => {
                        const completedToday = isCompletedToday(
                            habit.lastCompleted,
                        );

                        return (
                            <Card
                                key={habit.id}
                                className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">
                                            {habit.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            <span>
                                                {habit.streak} day streak
                                            </span>
                                        </div>
                                    </div>

                                    <form
                                        action={async () => {
                                            "use server";
                                            await completeHabit(habit.id);
                                        }}>
                                        <Button
                                            type="submit"
                                            disabled={completedToday}
                                            variant={
                                                completedToday
                                                    ? "secondary"
                                                    : "default"
                                            }
                                            className="flex gap-2">
                                            {completedToday ? (
                                                <>
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    Completed Today
                                                </>
                                            ) : (
                                                "Mark Complete"
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border border-dashed border-stone-200 rounded-xl dark:border-stone-800">
                        <p className="text-stone-400">
                            No habits added yet. Type one above to start
                            tracking!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
