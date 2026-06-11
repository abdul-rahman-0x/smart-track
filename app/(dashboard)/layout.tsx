import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppLayout } from "@/components/app-layout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Route security check: Redirect to login if user session is invalid
    if (!session?.user?.id) {
        redirect("/login");
    }

    return <AppLayout>{children}</AppLayout>;
}
