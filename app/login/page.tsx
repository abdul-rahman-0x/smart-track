import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/login/login-form";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
                <Link
                    href="/"
                    className="text-sm font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
                    smart track
                </Link>
                <ModeToggle />
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
                <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to access your smart track dashboard.
                        </p>
                    </div>

                    <LoginForm />

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        By continuing, you agree to smart track&apos;s terms of
                        service and privacy policy.
                    </p>
                </div>
            </main>
        </div>
    );
}
