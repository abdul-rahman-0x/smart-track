import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscriptionPlan } from "@/lib/subscription";
import { AppLayout } from "@/components/app-layout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const subscriptionPlan = await getSubscriptionPlan();

    return (
        <AppLayout user={session.user} isPro={subscriptionPlan.isPro}>
            {children}
        </AppLayout>
    );
}
