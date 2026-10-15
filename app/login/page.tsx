import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-emerald-500/20">
            {/* Topbar: Minimal escape hatch */}
            <header className="flex h-14 items-center justify-between px-6 border-b border-border/40">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Back to website</span>
                </Link>
                <ModeToggle />
            </header>

            {/* Centered Minimal Container */}
            <main className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Sign in to access your SmartTrack workspace.
                        </p>
                    </div>

                    {/* Google Button */}
                    <div className="rounded-xl border border-border/80 bg-card p-6 card-elevation">
                        <LoginForm />
                    </div>

                    {/* Subtle Legal Disclaimer */}
                    <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </main>
        </div>
    );
}
