import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { habits, habitCompletions } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { seedDefaultHabits } from "./actions";
import { HabitsClient } from "./habits-client";

interface PageProps {
    searchParams: Promise<{ date?: string }>;
}

export default async function HabitsPage({ searchParams }: PageProps) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) redirect("/login");

    const resolvedParams = await searchParams;
    const rawDate = resolvedParams.date;

    let selectedDate = new Date();
    if (rawDate) {
        const parsed = new Date(rawDate);
        if (!isNaN(parsed.getTime())) {
            selectedDate = parsed;
        }
    }

    // Calculate week limits
    const currentDayOfWeek = selectedDate.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Check if habits are empty. If they are, seed the 4 default templates
    let userHabits = await db.query.habits.findMany({
        where: eq(habits.userId, userId),
    });

    if (userHabits.length === 0) {
        await seedDefaultHabits(userId);
        userHabits = await db.query.habits.findMany({
            where: eq(habits.userId, userId),
        });
    }

    // Get active completions for the week
    const userCompletions = await db
        .select()
        .from(habitCompletions)
        .where(
            and(
                gte(habitCompletions.completedAt, monday),
                lte(habitCompletions.completedAt, sunday),
            ),
        );

    return (
        <HabitsClient
            selectedDateStr={selectedDate.toISOString().split("T")[0]}
            initialHabits={userHabits}
            initialCompletions={userCompletions}
        />
    );
}
