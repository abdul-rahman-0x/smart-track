import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { exams, tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { ExamsClient } from "./exams-client";

export default async function ExamsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const userId = session.user.id;

    // 1. Fetch user's exams sorted chronologically
    const userExams = await db.query.exams.findMany({
        where: eq(exams.userId, userId),
        orderBy: (e, { asc }) => [asc(e.date)],
    });

    // 2. Fetch any syllabus tasks (titles starting with '[EXAM:')
    const syllabusTasks = await db
        .select({
            id: tasks.id,
            title: tasks.title,
            completed: tasks.completed,
            dueDate: tasks.dueDate,
        })
        .from(tasks)
        .where(
            and(eq(tasks.userId, userId), sql`${tasks.title} LIKE '[EXAM:%'`),
        );

    return (
        <ExamsClient
            initialExams={userExams}
            initialSyllabusTasks={syllabusTasks}
        />
    );
}
