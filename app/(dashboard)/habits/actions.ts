"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const DEFAULT_HABITS = [
    "90 Min Uninterrupted Deep Work Block",
    "Morning Mindfulness & Hydration",
    "Read 15 Pages (Technical or Philosophy)",
];

// Helper: Seed default habits for new users
export async function seedDefaultHabits(userId: string) {
    const insertPromises = DEFAULT_HABITS.map((name) =>
        db.insert(habits).values({
            name,
            userId,
            category: "vitality",
            streak: 0,
        }),
    );
    await Promise.all(insertPromises);
}

// Action 1: Create a habit
export async function createHabit(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(habits).values({
        name,
        userId: session.user.id,
        category: "vitality",
        streak: 0,
    });

    revalidatePath("/habits");
}

// Action 2: Toggle a completion for a specific date
export async function toggleHabitDate(habitId: string, dateStr: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingCompletion = await db.query.habitCompletions.findFirst({
        where: and(
            eq(habitCompletions.habitId, habitId),
            gte(habitCompletions.completedAt, startOfDay),
            lte(habitCompletions.completedAt, endOfDay),
        ),
    });

    if (existingCompletion) {
        await db
            .delete(habitCompletions)
            .where(eq(habitCompletions.id, existingCompletion.id));
    } else {
        await db.insert(habitCompletions).values({
            habitId,
            completedAt: targetDate,
        });
    }

    await recalculateStreak(habitId);
    revalidatePath("/habits");
}

// Action 3: Delete a habit
export async function deleteHabit(habitId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db
        .delete(habits)
        .where(and(eq(habits.id, habitId), eq(habits.userId, session.user.id)));
    revalidatePath("/habits");
}

// Action 4: Reset all checkmarks for the active week
export async function resetWeekCompletions(mondayStr: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const mondayDate = new Date(mondayStr);
    mondayDate.setHours(0, 0, 0, 0);

    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);
    sundayDate.setHours(23, 59, 59, 999);

    // Fetch all user's habits
    const userHabits = await db
        .select({ id: habits.id })
        .from(habits)
        .where(eq(habits.userId, session.user.id));
    const habitIds = userHabits.map((h) => h.id);

    if (habitIds.length === 0) return;

    // Delete all completions for this week belonging to user's habits
    for (const habitId of habitIds) {
        await db
            .delete(habitCompletions)
            .where(
                and(
                    eq(habitCompletions.habitId, habitId),
                    gte(habitCompletions.completedAt, mondayDate),
                    lte(habitCompletions.completedAt, sundayDate),
                ),
            );
        await recalculateStreak(habitId);
    }

    revalidatePath("/habits");
}

// Helper: Calculate streaks
async function recalculateStreak(habitId: string) {
    const completions = await db.query.habitCompletions.findMany({
        where: eq(habitCompletions.habitId, habitId),
        orderBy: (hc, { desc }) => [desc(hc.completedAt)],
    });

    if (completions.length === 0) {
        await db
            .update(habits)
            .set({ streak: 0 })
            .where(eq(habits.id, habitId));
        return;
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);

    const latestCompletionDate = new Date(completions[0].completedAt);
    latestCompletionDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - latestCompletionDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
        await db
            .update(habits)
            .set({ streak: 0 })
            .where(eq(habits.id, habitId));
        return;
    }

    if (diffDays === 1) {
        expectedDate.setDate(today.getDate() - 1);
    }

    for (const comp of completions) {
        const compDate = new Date(comp.completedAt);
        compDate.setHours(0, 0, 0, 0);

        if (compDate.getTime() === expectedDate.getTime()) {
            streak += 1;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (compDate.getTime() < expectedDate.getTime()) {
            break;
        }
    }

    await db.update(habits).set({ streak }).where(eq(habits.id, habitId));
}
