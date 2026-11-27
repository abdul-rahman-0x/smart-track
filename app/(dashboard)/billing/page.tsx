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
    ArrowUpRight,
    AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const plan = await getSubscriptionPlan();
    const isPro = plan.isPro;
    const isCanceled = "isCanceled" in plan ? Boolean(plan.isCanceled) : false;
    const periodEndDate =
        "currentPeriodEnd" in plan && plan.currentPeriodEnd
            ? new Date(plan.currentPeriodEnd)
            : null;

    // Bound server action to avoid inline closure serialization issues
    async function handleCheckout() {
        "use server";
        const priceId =
            process.env.STRIPE_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
        if (!priceId) {
            throw new Error("Missing required STRIPE_PRICE_ID configuration.");
        }
        await createCheckoutSession(priceId);
    }

    return (
        <div className="space-y-10 pb-16 max-w-5xl mx-auto selection:bg-[#F9F8F6]/20">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#F9F8F6]/[0.08]">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            Membership & Billing
                        </h1>
                        <span
                            className={cn(
                                "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[4px] border",
                                isPro
                                    ? isCanceled
                                        ? "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30"
                                        : "bg-[#66CC63]/15 text-[#66CC63] border-[#66CC63]/30"
                                    : "bg-[#161616] text-[#F9F8F6]/60 border-[#F9F8F6]/[0.08]"
                            )}
                        >
                            {isPro
                                ? isCanceled
                                    ? "CANCELLATION PENDING"
                                    : "PRO ACTIVE"
                                : "FREE TIER"}
                        </span>
                    </div>
                    <p className="text-sm font-sans text-[#F9F8F6]/60">
                        Configure subscription tiers, invoice histories, and payment infrastructure.
                    </p>
                </div>

                {/* Renewal / Cancellation Status Pill */}
                {isPro && periodEndDate && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#161616] border border-[#F9F8F6]/[0.08] text-xs font-mono">
                        {isCanceled ? (
                            <AlertCircle className="size-3.5 text-[#FBBF24]" />
                        ) : (
                            <Calendar className="size-3.5 text-[#66CC63]" />
                        )}
                        <span className="text-[#F9F8F6]/60">
                            {isCanceled ? "Access terminates:" : "Renews:"}
                        </span>
                        <span className="font-medium text-[#F9F8F6] tabular-nums">
                            {format(periodEndDate, "MMM d, yyyy")}
                        </span>
                    </div>
                )}
            </header>

            {/* Side-by-Side Tier Matrix */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* 1. Free Baseline Tier */}
                <div
                    className={cn(
                        "rounded-[16px] border bg-[#161616] p-6 sm:p-8 flex flex-col justify-between transition-colors",
                        !isPro
                            ? "border-[#F9F8F6]/25"
                            : "border-[#F9F8F6]/[0.06] opacity-60 hover:opacity-100"
                    )}
                >
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-serif text-[#F9F8F6]">Free Baseline</h3>
                                <p className="text-xs font-sans text-[#F9F8F6]/50 mt-1">
                                    Core execution tooling for individual task tracking.
                                </p>
                            </div>
                            {!isPro && (
                                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#20201F] text-[#F9F8F6]/80 px-2 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08]">
                                    Current
                                </span>
                            )}
                        </div>

                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-mono font-medium tracking-tight text-[#F9F8F6]">
                                $0
                            </span>
                            <span className="text-xs font-mono text-[#F9F8F6]/40">/ perpetual</span>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-3 pt-4 border-t border-[#F9F8F6]/[0.06]">
                            {[
                                "Up to 3 active habit routines",
                                "1 active academic milestone target",
                                "10 daily scheduled execution tasks",
                                "Standard 25/5 focus sprint timer",
                                "7-day rolling momentum ledger history",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-xs font-sans text-[#F9F8F6]/60"
                                >
                                    <div className="size-4 rounded-[4px] bg-[#20201F] flex items-center justify-center shrink-0 border border-[#F9F8F6]/[0.08]">
                                        <Check className="size-2.5 text-[#F9F8F6]/60" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#F9F8F6]/[0.06]">
                        <Button
                            disabled
                            variant="outline"
                            className="w-full h-10 text-xs font-mono border-[#F9F8F6]/[0.08] bg-transparent text-[#F9F8F6]/40 cursor-not-allowed"
                        >
                            {!isPro ? "Current Workspace Plan" : "Included Baseline"}
                        </Button>
                    </div>
                </div>

                {/* 2. Pro Edition Tier */}
                <div
                    className={cn(
                        "rounded-[16px] border bg-[#161616] p-6 sm:p-8 flex flex-col justify-between relative transition-colors",
                        isPro
                            ? "border-[#66CC63]/40"
                            : "border-[#F9F8F6]/20 hover:border-[#F9F8F6]/40"
                    )}
                >
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-serif text-[#F9F8F6]">Pro Edition</h3>
                                    <Sparkles className="size-4 text-[#66CC63]" />
                                </div>
                                <p className="text-xs font-sans text-[#F9F8F6]/50 mt-1">
                                    Full deep-work infrastructure with automated academic pacing.
                                </p>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider bg-[#20201F] text-[#66CC63] px-2 py-0.5 rounded-[4px] border border-[#66CC63]/30">
                                {isPro ? "Active Tier" : "Recommended"}
                            </span>
                        </div>

                        <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl font-mono font-medium tracking-tight text-[#F9F8F6]">
                                $9
                            </span>
                            <span className="text-xs font-mono text-[#F9F8F6]/40">
                                / month (cancel anytime)
                            </span>
                        </div>

                        {/* Pro Checklist */}
                        <div className="space-y-3 pt-4 border-t border-[#F9F8F6]/[0.06]">
                            {[
                                "Unlimited habit routines & streak freezes",
                                "Unlimited exam milestones + Automated Daily Pacing",
                                "Unlimited daily planner tasks with priority engine",
                                "Full 365-day annual momentum ledger",
                                "Cloud state preservation with zero data decay",
                                "Custom focus intervals & background soundscapes",
                            ].map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-xs font-sans text-[#F9F8F6]/90 font-medium"
                                >
                                    <div className="size-4 rounded-[4px] bg-[#66CC63]/15 border border-[#66CC63]/30 flex items-center justify-center shrink-0">
                                        <Check className="size-2.5 text-[#66CC63] stroke-[3]" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Trigger */}
                    <div className="pt-6 mt-6 border-t border-[#F9F8F6]/[0.06]">
                        {isPro ? (
                            <form action={createPortalSession}>
                                <Button
                                    type="submit"
                                    className="w-full h-10 text-xs font-sans font-medium bg-[#20201F] text-[#F9F8F6] hover:bg-[#2A2A29] border border-[#F9F8F6]/[0.1] rounded-[8px] flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="size-3.5" />
                                    Manage Subscription & Billing Portal
                                </Button>
                            </form>
                        ) : (
                            <form action={handleCheckout}>
                                <Button
                                    type="submit"
                                    className="w-full h-10 text-xs font-sans font-medium bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] rounded-[8px] flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="size-3.5 fill-current" />
                                    Upgrade to Pro — $9/mo
                                    <ArrowUpRight className="size-3.5 stroke-[2.5]" />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Security & Payment Verification */}
            <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-[#F9F8F6]/60">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-[8px] bg-[#20201F] flex items-center justify-center text-[#66CC63] border border-[#F9F8F6]/[0.08] shrink-0">
                        <ShieldCheck className="size-4" />
                    </div>
                    <div>
                        <span className="font-medium text-[#F9F8F6] block">
                            Cryptographic Payment Verification
                        </span>
                        <span className="text-[11px] text-[#F9F8F6]/50">
                            Transactions are processed directly through Stripe with 256-bit encryption. Card credentials never touch our servers.
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#F9F8F6]/40 shrink-0">
                    <HelpCircle className="size-3.5" />
                    <span>Billing Support: support@smarttrack.io</span>
                </div>
            </div>
        </div>
    );
}
