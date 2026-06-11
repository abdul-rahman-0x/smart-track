"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Action 1: Create a new academic exam
export async function createExam(
    subject: string,
    dateStr: string,
    notes?: string,
) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const examDate = new Date(dateStr);
    examDate.setHours(12, 0, 0, 0); // Normalize timezone offset

    await db.insert(exams).values({
        subject,
        date: examDate,
        notes: notes || null,
        userId: session.user.id,
    });

    revalidatePath("/exams");
    revalidatePath("/dashboard");
}

// Action 2: Delete an exam
export async function deleteExam(examId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db
        .delete(exams)
        .where(and(eq(exams.id, examId), eq(exams.userId, session.user.id)));

    revalidatePath("/exams");
    revalidatePath("/dashboard");
}

// Action 3: Add a syllabus sub-chapter or topic (Stored in tasks with special exam prefix)
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
