"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { count, eq, and, gte, lte } from "drizzle-orm";

// Action 1: Count how many focus sessions the user has completed today
export async function getTodayFocusCount() {
    const session = await auth();
    if (!session?.user?.id) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // We search for our specific focus task prefix
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

// Action 2: Log a completed focus session directly to the daily planner as an achievement
export async function logCompletedSession() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(12, 0, 0, 0); // Normalize to prevent timeline shifts

    await db.insert(tasks).values({
        title: "[FOCUS] 25m Focus Session",
        userId: session.user.id,
        completed: true, // Marked completed immediately as an achievement!
        dueDate: today,
        priority: "low",
    });

    revalidatePath("/planner");
    revalidatePath("/dashboard");
    revalidatePath("/focus");
}
