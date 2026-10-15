"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { count, eq, and, gte, lte, like } from "drizzle-orm";

// Action 1: Count all completed focus blocks for today (25m, 50m, or custom)
export async function getTodayFocusCount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await db
        .select({ count: count() })
        .from(tasks)
        .where(
            and(
                eq(tasks.userId, session.user.id),
                gte(tasks.dueDate, today),
                lte(tasks.dueDate, endOfDay),
                like(tasks.title, "[FOCUS]%"),
            ),
        );

    return result[0]?.count || 0;
}

// Action 2: Log a completed session with flexible duration support
export async function logCompletedSession(durationMinutes: number = 25) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    await db.insert(tasks).values({
        title: `[FOCUS] ${durationMinutes}m Focus Session`,
        userId: session.user.id,
        completed: true,
        dueDate: today,
        priority: "low",
    });

    revalidatePath("/planner");
    revalidatePath("/dashboard");
    revalidatePath("/focus");
}

// Action 3: Reset all logged focus sessions for today
export async function resetTodayFocusSessions() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    await db
        .delete(tasks)
        .where(
            and(
                eq(tasks.userId, session.user.id),
                gte(tasks.dueDate, today),
                lte(tasks.dueDate, endOfDay),
                like(tasks.title, "[FOCUS]%"),
            ),
        );

    revalidatePath("/planner");
    revalidatePath("/dashboard");
    revalidatePath("/focus");
}
