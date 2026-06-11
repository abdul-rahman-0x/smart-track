import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch all tasks for the logged-in user to compute calendar completion activity
    const userTasks = await db
        .select({
            id: tasks.id,
            title: tasks.title,
            completed: tasks.completed,
            dueDate: tasks.dueDate,
            priority: tasks.priority,
        })
        .from(tasks)
        .where(eq(tasks.userId, session.user.id));

    return <CalendarClient initialTasks={userTasks} />;
}
