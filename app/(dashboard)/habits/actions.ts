"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Action 1: Create a new habit
export async function createHabit(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(habits).values({
        name,
        userId: session.user.id,
        streak: 0,
    });

    revalidatePath("/habits");
    revalidatePath("/dashboard");
}

// Action 2: Complete a habit and calculate streaks
export async function completeHabit(habitId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Fetch current habit state
    const currentHabit = await db.query.habits.findFirst({
        where: and(eq(habits.id, habitId), eq(habits.userId, session.user.id)),
    });

    if (!currentHabit) throw new Error("Habit not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = currentHabit.streak;

    if (currentHabit.lastCompleted) {
        const lastCompletedDate = new Date(currentHabit.lastCompleted);
        lastCompletedDate.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - lastCompletedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Already completed today, do nothing to prevent double-logging
            return { success: false, message: "Already completed today" };
        } else if (diffDays === 1) {
            // Completed yesterday, continue the streak
            newStreak += 1;
        } else {
            // Streak broken, reset to 1
            newStreak = 1;
        }
    } else {
        // First completion ever
        newStreak = 1;
    }

    // Update the habit record in Neon Postgres
    await db
        .update(habits)
        .set({
            streak: newStreak,
            lastCompleted: today,
        })
        .where(eq(habits.id, habitId));

    revalidatePath("/habits");
    revalidatePath("/dashboard");
    return { success: true };
}
