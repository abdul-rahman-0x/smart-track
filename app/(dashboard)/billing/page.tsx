import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionPlan } from "@/lib/subscription";
import {
    createCheckoutSession,
    createPortalSession,
} from "@/app/billing/actions";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { format } from "date-fns";

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const plan = await getSubscriptionPlan();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="border-b border-border/40 pb-6">
                <h1 className="text-xl font-bold tracking-tight">Membership</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
                    Account & Billing
                </p>
            </header>

            <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl border border-border/40 bg-secondary/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-primary" />
                            <span className="text-sm font-bold">
                                Current Plan
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">
                                {plan.isPro ? "Pro Member" : "Free Tier"}
                            </h2>
                            {/* Check if currentPeriodEnd exists on the plan object */}
                            {plan.isPro &&
                                "currentPeriodEnd" in plan &&
                                plan.currentPeriodEnd && (
                                    <p className="text-[11px] text-muted-foreground font-medium">
                                        Renews{" "}
                                        {format(
                                            plan.currentPeriodEnd,
                                            "MMM do, yyyy",
                                        )}
                                    </p>
                                )}
                        </div>
                        <form
                            action={
                                plan.isPro ? createPortalSession : undefined
                            }>
                            <Button
                                disabled={!plan.isPro}
                                className="w-full h-9 text-[11px] font-bold uppercase tracking-wider"
                                variant="outline">
                                <CreditCard className="size-3.5 mr-2" />
                                Manage Billing
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Platform Capabilities
                        </h3>
                        <div className="grid gap-3">
                            {[
                                "Unlimited Habit Tracking",
                                "Advanced Exam Milestones",
                                "Priority Task Engine",
                                "Two-way Calendar Sync",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                    <div className="size-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Check className="size-3 text-primary stroke-3" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {!plan.isPro && (
                        <form
                            action={async () => {
                                "use server";
                                await createCheckoutSession(
                                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
                                );
                            }}>
                            <Button className="w-full h-12 rounded-xl bg-primary hover:opacity-90 transition-all shadow-xl shadow-primary/20 text-xs font-bold uppercase tracking-widest gap-2">
                                <Sparkles className="size-4 fill-current" />
                                Upgrade to Pro — $3/mo
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
