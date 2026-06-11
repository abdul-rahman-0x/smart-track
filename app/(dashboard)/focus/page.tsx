import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTodayFocusCount } from "./actions";
import { FocusClient } from "./focus-client";

export default async function FocusPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    // Load the user's completed focus blocks for today (used to enforce limits)
    const initialFocusCount = await getTodayFocusCount();

    return <FocusClient initialFocusCount={initialFocusCount} />;
}
