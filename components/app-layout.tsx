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
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import type { Session } from "next-auth";

import { BrandMark } from "@/components/brand-mark";
import { Logo } from "@/components/logo";
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
    { label: "Focus State", href: "/focus", icon: Timer },
    { label: "Billing", href: "/billing", icon: CreditCard },
] as const;

type NavLinksProps = {
    onNavigate?: () => void;
    isCollapsed?: boolean;
};

const NavLinks = ({ onNavigate, isCollapsed = false }: NavLinksProps) => {
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
                        title={isCollapsed ? label : undefined} // Tooltip on hover
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isCollapsed ? "justify-center px-1" : "",
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}>
                        <Icon className="size-4 shrink-0" />
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                );
            })}
        </nav>
    );
};

type SidebarContentProps = {
    onNavigate?: () => void;
    session: Session | null;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
};

const SidebarContent = ({
    onNavigate,
    session,
    isCollapsed = false,
    onToggleCollapse,
}: SidebarContentProps) => {
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Sidebar Header (Adapts layout depending on collapse state) */}
            <div
                className={cn(
                    "border-b border-sidebar-border flex items-center justify-between shrink-0",
                    isCollapsed
                        ? "flex-col py-3 gap-2 h-[85px] justify-center"
                        : "px-4 py-5 h-[73px]",
                )}>
                {isCollapsed ? (
                    <Logo className="size-7" />
                ) : (
                    <BrandMark href="/dashboard" variant="sidebar" />
                )}

                {/* Dynamic Collapse Trigger (Hides on mobile, handles Chevron state on desktop) */}
                {onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className="hidden md:flex p-1.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none"
                        title={
                            isCollapsed
                                ? "Expand sidebar (Ctrl+B)"
                                : "Collapse sidebar (Ctrl+B)"
                        }>
                        {isCollapsed ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <ChevronLeft className="size-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavLinks onNavigate={onNavigate} isCollapsed={isCollapsed} />
            </div>

            {/* Sidebar Footer */}
            <div
                className={cn(
                    "border-t border-sidebar-border shrink-0",
                    isCollapsed
                        ? "py-4 flex flex-col items-center gap-4"
                        : "px-4 py-4 space-y-4",
                )}>
                {session?.user && (
                    <div
                        className={cn(
                            "flex items-center justify-between gap-3",
                            isCollapsed ? "flex-col items-center" : "",
                        )}>
                        <div
                            className={cn(
                                "flex items-center gap-3 min-w-0",
                                isCollapsed ? "flex-col" : "",
                            )}>
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    alt={session.user.name || "User"}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    className="size-8 rounded-full border border-sidebar-border"
                                />
                            ) : (
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
                            {!isCollapsed && (
                                <div className="min-w-0">
                                    <p className="text-xs font-bold truncate leading-tight">
                                        {session.user.name}
                                    </p>
                                    <p className="text-[10px] text-sidebar-foreground/60 truncate">
                                        {session.user.email}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none"
                            title="Sign Out">
                            <LogOut className="size-4" />
                        </button>
                    </div>
                )}

                <div
                    className={cn(
                        "flex items-center justify-between",
                        isCollapsed ? "flex-col" : "",
                    )}>
                    {!isCollapsed && (
                        <span className="text-xs text-sidebar-foreground/60 font-medium">
                            Theme Mode
                        </span>
                    )}
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
    const [isCollapsed, setIsCollapsed] = useState(false);

    // --- KEYBOARD SHORTCUTS: Cmd/Ctrl + B to toggle desktop collapse ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
                e.preventDefault();
                setIsCollapsed((prev) => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar Panel (Width transitions cleanly between w-64 and w-16) */}
            <aside
                className={cn(
                    "hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col transition-all duration-75",
                    isCollapsed ? "w-16" : "w-64",
                )}>
                <SidebarContent
                    session={session}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />
            </aside>

            {/* Content Space Container */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile Header (Strictly hidden on desktop to completely prevent layout shift) */}
                <header className="flex h-14 items-center justify-between border-b border-border px-4 py-3 md:hidden shrink-0">
                    <div className="flex items-center gap-3">
                        <Sheet
                            open={mobileNavOpen}
                            onOpenChange={setMobileNavOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Open menu"
                                    className="size-8">
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

                        <BrandMark
                            href="/dashboard"
                            size="sm"
                            variant="sidebar"
                        />
                    </div>
                </header>

                {/* Core Page Canvas */}
                <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
