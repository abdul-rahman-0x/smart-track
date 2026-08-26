"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { getSubscriptionPlan } from "@/lib/subscription";
import { z } from "zod";

const taskSchema = z.object({
    title: z.string().min(1).max(100),
    priority: z.enum(["low", "medium", "high"]),
    dueDateStr: z.string(),
});

export async function createPlannerTask(values: z.infer<typeof taskSchema>) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const { title, priority, dueDateStr } = taskSchema.parse(values);
    const sub = await getSubscriptionPlan();

    if (!sub.isPro) {
        const [existing] = await db
            .select({ val: count() })
            .from(tasks)
            .where(
                and(
                    eq(tasks.userId, session.user.id),
                    eq(tasks.completed, false),
                ),
            );
        if (existing.val >= 10) throw new Error("PRO_LIMIT_REACHED");
    }

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(12, 0, 0, 0);

    await db.insert(tasks).values({
        title,
        userId: session.user.id,
        priority,
        dueDate,
    });

    revalidatePath("/planner");
}

export async function toggleTask(taskId: string, completed: boolean) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db
        .update(tasks)
        .set({ completed })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

    revalidatePath("/planner");
}

export async function deleteTask(taskId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db
        .delete(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

    revalidatePath("/planner");
}
