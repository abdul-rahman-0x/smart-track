import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { auth } from "@/auth";
import { ArrowLeft } from "lucide-react";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0E0D0C] text-[#F9F8F6] selection:bg-[#20201F] selection:text-[#F9F8F6]">
            {/* Topbar */}
            <header className="flex h-16 items-center justify-between px-6 border-b border-[#F9F8F6]/[0.06]">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-sans text-[#F9F8F6]/60 hover:text-[#F9F8F6] transition-colors group"
                >
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                    <span>Return to website</span>
                </Link>
            </header>

            {/* Auth Container */}
            <main className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-center space-y-1.5">
                        <h1 className="font-serif text-3xl font-normal tracking-[-0.028em] text-[#F9F8F6]">
                            Welcome back
                        </h1>
                        <p className="text-sm font-sans text-[#F9F8F6]/60">
                            Sign in to access your SmartTrack workspace.
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-[16px] border border-[#F9F8F6]/[0.08] bg-[#161616] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                        <LoginForm />
                    </div>

                    {/* Legal Footer Links */}
                    <p className="text-center text-xs font-sans text-[#F9F8F6]/40 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="text-[#F9F8F6]/70 underline underline-offset-4 hover:text-[#F9F8F6] transition-colors"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-[#F9F8F6]/70 underline underline-offset-4 hover:text-[#F9F8F6] transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </main>
        </div>
    );
}
