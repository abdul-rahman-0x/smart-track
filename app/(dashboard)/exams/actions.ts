"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, tasks } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { getSubscriptionPlan } from "@/lib/subscription";
import { z } from "zod";

const examSchema = z.object({
    subject: z.string().min(1).max(50),
    dateStr: z.string(),
    notes: z.string().max(200).optional(),
});

export async function createExam(
    subject: string,
    dateStr: string,
    notes?: string,
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = examSchema.parse({ subject, dateStr, notes });
    const sub = await getSubscriptionPlan();

    if (!sub.isPro) {
        const [existing] = await db
            .select({ val: count() })
            .from(exams)
            .where(eq(exams.userId, session.user.id));
        if (existing.val >= 3) throw new Error("PRO_LIMIT_REACHED");
    }

    const examDate = new Date(validated.dateStr);
    examDate.setHours(12, 0, 0, 0);

    await db.insert(exams).values({
        subject: validated.subject,
        date: examDate,
        notes: validated.notes || null,
        userId: session.user.id,
    });

    revalidatePath("/exams");
}

export async function deleteExam(examId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db
        .delete(exams)
        .where(and(eq(exams.id, examId), eq(exams.userId, session.user.id)));
    revalidatePath("/exams");
}

export async function addSyllabusTopic(
    examId: string,
    title: string,
    dueDateStr: string,
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const dueDate = new Date(dueDateStr);
    dueDate.setHours(12, 0, 0, 0);

    await db.insert(tasks).values({
        title: `[EXAM:${examId}] ${title}`,
        userId: session.user.id,
        completed: false,
        dueDate,
        priority: "medium",
    });

    revalidatePath("/exams");
}
