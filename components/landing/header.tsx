import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default async function Header() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-stone-200/40 dark:border-stone-800/40 bg-stone-50/80 backdrop-blur-md dark:bg-stone-950/80">
            <div className="flex items-center gap-3">
                <Logo className="w-8 h-8" />
                <span className="font-semibold text-xl tracking-tight">
                    smart-track
                </span>
            </div>

            <div className="flex items-center gap-4">
                {session ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/login">Sign in</Link>
                    </Button>
                )}
                <ModeToggle />
            </div>
        </header>
    );
}
