"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema";
import { eq, and, count, gte, lte } from "drizzle-orm";
import { getSubscriptionPlan } from "@/lib/subscription";
import { z } from "zod";

const habitSchema = z.object({
    name: z.string().min(1).max(30),
});

export async function seedDefaultHabits(userId: string) {
    const defaults = ["90 Min Deep Work", "Meditation", "Technical Reading"];
    await Promise.all(
        defaults.map((name) =>
            db.insert(habits).values({ name, userId, category: "general" }),
        ),
    );
}

export async function createHabit(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const validated = habitSchema.parse({ name });
    const sub = await getSubscriptionPlan();
    if (!sub.isPro) {
        const [existing] = await db
            .select({ val: count() })
            .from(habits)
            .where(eq(habits.userId, session.user.id));
        if (existing.val >= 3) throw new Error("PRO_REQUIRED");
    }
    await db
        .insert(habits)
        .values({ name: validated.name, userId: session.user.id });
    revalidatePath("/habits");
}

export async function toggleHabitDate(habitId: string, dateStr: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const existing = await db.query.habitCompletions.findFirst({
        where: and(
            eq(habitCompletions.habitId, habitId),
            eq(habitCompletions.completedAt, targetDate),
        ),
    });
    if (existing) {
        await db
            .delete(habitCompletions)
            .where(eq(habitCompletions.id, existing.id));
    } else {
        await db
            .insert(habitCompletions)
            .values({ habitId, completedAt: targetDate });
    }
    revalidatePath("/habits");
}

export async function deleteHabit(id: string) {
    const session = await auth();
    if (!session?.user?.id) return;
    await db
        .delete(habits)
        .where(and(eq(habits.id, id), eq(habits.userId, session.user.id)));
    revalidatePath("/habits");
}

export async function resetWeekCompletions(mondayStr: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    const start = new Date(mondayStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    await db
        .delete(habitCompletions)
        .where(
            and(
                gte(habitCompletions.completedAt, start),
                lte(habitCompletions.completedAt, end),
            ),
        );

    revalidatePath("/habits");
}
