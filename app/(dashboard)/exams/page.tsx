import { auth } from "@/auth";
import { db } from "@/db";
import { exams, tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ExamsClient } from "./exams-client";
import { getSubscriptionPlan } from "@/lib/subscription";

export default async function ExamsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const [userExams, syllabusTasks, sub] = await Promise.all([
        db.query.exams.findMany({
            where: eq(exams.userId, session.user.id),
            orderBy: (e, { asc }) => [asc(e.date)],
        }),
        db
            .select()
            .from(tasks)
            .where(
                and(
                    eq(tasks.userId, session.user.id),
                    sql`${tasks.title} LIKE '[EXAM:%'`,
                ),
            ),
        getSubscriptionPlan(),
    ]);

    return (
        <ExamsClient
            initialExams={userExams}
            initialSyllabusTasks={syllabusTasks}
            isPro={sub.isPro}
        />
    );
}
