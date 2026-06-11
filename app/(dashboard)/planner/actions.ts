"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

// Action 1: Create a planner item (either a daily task, prioritized task, or hourly block)
export async function createPlannerTask({
  title,
  dueDateStr,
  priority = "medium",
}: {
  title: string;
  dueDateStr: string;
  priority?: "low" | "medium" | "high";
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const dueDate = new Date(dueDateStr);
  dueDate.setHours(12, 0, 0, 0); // Normalize to avoid timezone shifting

  await db.insert(tasks).values({
    title,
    userId: session.user.id,
    completed: false,
    dueDate,
    priority,
  });

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

// Action 2: Toggle task completion status
export async function toggleTask(taskId: string, completed: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(tasks)
    .set({ completed })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

// Action 3: Delete a single task
export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

// Action 4: Clear all tasks for a specific day
export async function clearDayTasks(dateStr: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const startOfDay = new Date(targetDate);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.userId, session.user.id),
        gte(tasks.dueDate, startOfDay),
        lte(tasks.dueDate, endOfDay)
      )
    );

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}

// Action 5: Clear all tasks for the active week
export async function clearWeekTasks(mondayStr: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const mondayDate = new Date(mondayStr);
  mondayDate.setHours(0, 0, 0, 0);

  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 6);
  sundayDate.setHours(23, 59, 59, 999);

  await db
    .delete(tasks)
    .where(
      and(
        eq(tasks.userId, session.user.id),
        gte(tasks.dueDate, mondayDate),
        lte(tasks.dueDate, sundayDate)
      )
    );

  revalidatePath("/planner");
  revalidatePath("/dashboard");
}