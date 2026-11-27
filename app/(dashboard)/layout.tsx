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
    if (!session?.user?.id) redirect("/login");

    const subscriptionPlan = await getSubscriptionPlan();

    return (
        <div className="min-h-screen bg-[#0E0D0C] text-[#F9F8F6] font-sans text-[15px] antialiased selection:bg-[#20201F] selection:text-[#F9F8F6]">
            <AppLayout user={session.user} isPro={subscriptionPlan.isPro}>
                {children}
            </AppLayout>
        </div>
    );
}
