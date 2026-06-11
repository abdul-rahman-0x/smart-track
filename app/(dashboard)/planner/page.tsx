import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { PlannerClient } from "./planner-client";

interface PageProps {
    searchParams: Promise<{ date?: string }>;
}

export default async function PlannerPage({ searchParams }: PageProps) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const resolvedParams = await searchParams;
    const rawDate = resolvedParams.date;

    // 1. Resolve selected date (default to today if missing or invalid)
    let selectedDate = new Date();
    if (rawDate) {
        const parsed = new Date(rawDate);
        if (!isNaN(parsed.getTime())) {
            selectedDate = parsed;
        }
    }

    // 2. Calculate boundary dates for the current week (Monday to Sunday)
    const currentDayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday etc.
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const mondayDate = new Date(selectedDate);
    mondayDate.setDate(selectedDate.getDate() + distanceToMonday);
    mondayDate.setHours(0, 0, 0, 0);

    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6);
    sundayDate.setHours(23, 59, 59, 999);

    // 3. Load all tasks created by the user for the active week
    const userTasks = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.userId, session.user.id),
                gte(tasks.dueDate, mondayDate),
                lte(tasks.dueDate, sundayDate),
            ),
        );

    return (
        <PlannerClient
            selectedDateStr={selectedDate.toISOString().split("T")[0]}
            initialTasks={userTasks}
        />
    );
}
