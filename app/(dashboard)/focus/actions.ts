"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { count, eq, and, gte, lte } from "drizzle-orm";

// Action 1: Count completed focus blocks for today
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
                eq(tasks.title, "[FOCUS] 25m Focus Session"),
            ),
        );

    return result[0]?.count || 0;
}

// Action 2: Log a completed session
export async function logCompletedSession() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    await db.insert(tasks).values({
        title: "[FOCUS] 25m Focus Session",
        userId: session.user.id,
        completed: true,
        dueDate: today,
        priority: "low",
    });

    revalidatePath("/planner");
    revalidatePath("/dashboard");
    revalidatePath("/focus");
}

// Action 3: FIXED: Added dynamic reset action to clear today's logged focus sessions
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
                eq(tasks.title, "[FOCUS] 25m Focus Session"),
            ),
        );

    revalidatePath("/planner");
    revalidatePath("/dashboard");
    revalidatePath("/focus");
}
