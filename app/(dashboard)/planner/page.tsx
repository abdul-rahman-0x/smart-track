import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, exams } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PlannerClient } from "./planner-client";
import { getSubscriptionPlan } from "@/lib/subscription";

export default async function PlannerPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { date } = await searchParams;
    const selectedDate = date ? new Date(date) : new Date();

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const [userTasks, userExams, sub] = await Promise.all([
        db
            .select()
            .from(tasks)
            .where(
                and(
                    eq(tasks.userId, session.user.id),
                    gte(tasks.dueDate, start),
                    lte(tasks.dueDate, end),
                ),
            ),
        db.select().from(exams).where(eq(exams.userId, session.user.id)),
        getSubscriptionPlan(),
    ]);

    return (
        <PlannerClient
            initialTasks={userTasks}
            exams={userExams}
            isPro={sub.isPro}
            selectedDateStr={selectedDate.toISOString().split("T")[0]}
        />
    );
}
