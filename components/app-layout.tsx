"use client";

import {
    CalendarDays,
    GraduationCap,
    LayoutDashboard,
    ListTodo,
    Menu,
    Sparkles,
    Timer,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";

import { BrandMark } from "@/components/brand-mark";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Planner", href: "/planner", icon: Sparkles },
    { label: "Habits", href: "/habits", icon: ListTodo },
    { label: "Exams", href: "/exams", icon: GraduationCap },
    { label: "Focus", href: "/focus", icon: Timer },
] as const;

type NavLinksProps = {
    onNavigate?: () => void;
};

const NavLinks = ({ onNavigate }: NavLinksProps) => {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}>
                        <Icon className="size-4 shrink-0" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
};

type SidebarContentProps = {
    onNavigate?: () => void;
    session: Session | null;
};

const SidebarContent = ({ onNavigate, session }: SidebarContentProps) => {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-sidebar-border px-4 py-5">
                <BrandMark href="/dashboard" variant="sidebar" />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavLinks onNavigate={onNavigate} />
            </div>

            <div className="border-t border-sidebar-border px-4 py-4 space-y-4">
                {session?.user && (
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            {session.user.image ? (
                                /* FIXED: Replaced standard img with Next.js Image to resolve LCP warnings */
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    width={32}
                                    height={32}
                                    unoptimized // Bypasses Next.js domains config to support raw google URLs safely
                                    className="size-8 rounded-full border border-sidebar-border"
                                />
                            ) : (
                                /* FIXED: Generates an elegant SVG user silhouette avatar if Google image is absent */
                                <svg
                                    className="size-8 rounded-full border border-sidebar-border bg-sidebar-accent text-sidebar-foreground/60 p-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold truncate leading-tight">
                                    {session.user.name}
                                </p>
                                <p className="text-[10px] text-sidebar-foreground/60 truncate">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none"
                            title="Sign Out">
                            <LogOut className="size-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-xs text-sidebar-foreground/60">
                        Theme Mode
                    </span>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};

type AppLayoutProps = {
    children: React.ReactNode;
    session: Session | null;
};

export const AppLayout = ({ children, session }: AppLayoutProps) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="hidden shrink-0 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
                <SidebarContent session={session} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
                    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Open menu">
                                <Menu className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-full max-w-xs border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
                            <SheetTitle className="sr-only">
                                Navigation menu
                            </SheetTitle>
                            <SidebarContent
                                session={session}
                                onNavigate={() => setMobileNavOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>

                    <BrandMark href="/dashboard" size="sm" variant="sidebar" />
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
            </div>
        </div>
    );
};
