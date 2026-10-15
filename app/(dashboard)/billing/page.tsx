import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionPlan } from "@/lib/subscription";
import {
    createCheckoutSession,
    createPortalSession,
} from "@/app/billing/actions";
import { Button } from "@/components/ui/button";
import {
    Check,
    CreditCard,
    Sparkles,
    ShieldCheck,
    Calendar,
    HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const plan = await getSubscriptionPlan();
    const isPro = plan.isPro;

    return (
        <div className="relative space-y-10 pb-16 max-w-5xl mx-auto">
            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/4 blur-3xl pointer-events-none rounded-full" />

            {/* --- HEADER --- */}
            <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                            Membership & Billing
                        </h1>
                        <span
                            className={cn(
                                "text-xs font-medium px-2.5 py-0.5 rounded-full border",
                                isPro
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-secondary text-muted-foreground border-border/80",
                            )}
                        >
                            {isPro ? "Pro Plan Active" : "Free Tier"}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Manage your subscription tier, billing cycle, and Stripe payment
                        methods.
                    </p>
                </div>

                {isPro && "currentPeriodEnd" in plan && plan.currentPeriodEnd && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/80 card-elevation text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-emerald-500" />
                        <span>Renews: </span>
                        <span className="font-semibold text-foreground">
                            {format(plan.currentPeriodEnd, "MMM d, yyyy")}
                        </span>
                    </div>
                )}
            </header>

            {/* --- SIDE-BY-SIDE TIER COMPARISON MATRIX --- */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* 1. FREE TIER CARD */}
                <div
                    className={cn(
                        "rounded-2xl border bg-card p-6 sm:p-7 card-elevation flex flex-col justify-between transition-all",
                        !isPro
                            ? "border-border/90 ring-1 ring-border/50"
                            : "border-border/60 opacity-80",
                    )}
                >
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Free Tier</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Essential baseline for daily task tracking.
                                </p>
                            </div>
                            {!isPro && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border">
                                    Current Plan
                                </span>
                            )}
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold tracking-tight text-foreground">
                                $0
                            </span>
                            <span className="text-xs text-muted-foreground">/ forever</span>
                        </div>

                        {/* Free Features Checklist */}
                        <div className="space-y-3 pt-3 border-t border-border/50">
                            {[
                                "Up to 3 active habit routines",
                                "1 active academic exam countdown",
                                "10 daily scheduled planner tasks",
                                "Standard 25/5 Pomodoro focus timer",
                                "7-day consistency timeline history",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2.5 text-xs text-muted-foreground"
                                >
                                    <div className="size-4 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border">
                                        <Check className="size-2.5 text-foreground/70" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-border/40">
                        <Button
                            disabled
                            variant="outline"
                            className="w-full h-10 text-xs font-semibold border-border bg-secondary/30 text-muted-foreground"
                        >
                            {!isPro ? "Current Workspace Plan" : "Included Baseline"}
                        </Button>
                    </div>
                </div>

                {/* 2. PRO TIER CARD ($3/MO) */}
                <div
                    className={cn(
                        "rounded-2xl border bg-card p-6 sm:p-7 card-elevation flex flex-col justify-between relative overflow-hidden transition-all",
                        isPro
                            ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                            : "border-border hover:border-emerald-500/40",
                    )}
                >
                    {/* Top Recommended Pill */}
                    <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                        {isPro ? "Active Plan" : "Recommended"}
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="text-lg font-bold text-foreground">
                                    Pro Edition
                                </h3>
                                <Sparkles className="size-4 text-emerald-500 fill-current" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Full deep-work power with automated study tools.
                            </p>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold tracking-tight text-foreground">
                                $9
                            </span>
                            <span className="text-xs text-muted-foreground">
                                / month (cancel anytime)
                            </span>
                        </div>

                        {/* Pro Features Checklist */}
                        <div className="space-y-3 pt-3 border-t border-border/50">
                            {[
                                "Unlimited habit routines & streak freezes",
                                "Unlimited exam milestones + Daily Syllabus Pacing",
                                "Unlimited daily planner tasks with priority engine",
                                "Full 365-day annual consistency heatmaps",
                                "Two-way Google & Outlook Calendar Sync",
                                "Custom focus intervals & flow-state soundscapes",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2.5 text-xs text-foreground/90 font-medium"
                                >
                                    <div className="size-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                        <Check className="size-2.5 text-emerald-500 stroke-3" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Action Buttons */}
                    <div className="pt-6 mt-6 border-t border-border/40">
                        {isPro ? (
                            <form action={createPortalSession}>
                                <Button
                                    type="submit"
                                    className="btn-tactile w-full h-11 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="size-4" />
                                    Manage Subscription & Invoices
                                </Button>
                            </form>
                        ) : (
                            <form
                                action={async () => {
                                    "use server";
                                    await createCheckoutSession(
                                        process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
                                    );
                                }}
                            >
                                <Button
                                    type="submit"
                                    className="btn-tactile w-full h-11 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="size-4 text-emerald-500 fill-current" />
                                    Upgrade to Pro — $9/mo
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* --- SECURITY & GUARANTEE BANNER --- */}
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-emerald-500 shrink-0" />
                    <div>
                        <span className="font-semibold text-foreground block">
                            Bank-Grade Security
                        </span>
                        <span>
                            Payments are securely handled via Stripe with 256-bit encryption.
                            We never store credit cards.
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 shrink-0">
                    <HelpCircle className="size-3.5" />
                    <span>Questions? Reach out to support</span>
                </div>
            </div>
        </div>
    );
}
