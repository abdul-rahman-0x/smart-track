"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    CalendarDays,
    Sparkles,
    ListTodo,
    GraduationCap,
    Timer,
    Settings2,
    LogOut,
    ChevronLeft,
    PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "next-auth";

interface AppLayoutProps {
    children: React.ReactNode;
    user: User;
    isPro: boolean;
}

const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/calendar", icon: CalendarDays },
    { label: "Smart Planner", href: "/planner", icon: Sparkles },
    { label: "Habit Tracker", href: "/habits", icon: ListTodo },
    { label: "Academic", href: "/exams", icon: GraduationCap },
    { label: "Deep Work", href: "/focus", icon: Timer },
    { label: "Settings", href: "/billing", icon: Settings2 },
];

const SidebarContent = ({
    collapsed = false,
    pathname,
    user,
    isPro,
    onLinkClick,
}: {
    collapsed?: boolean;
    pathname: string;
    user: User;
    isPro: boolean;
    onLinkClick?: () => void;
}) => (
    <div className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
        {/* Continuous Sidebar Header */}
        <div className="px-6 pt-8 pb-6">
            <Link
                href="/dashboard"
                onClick={onLinkClick}
                className="flex items-center gap-3 group">
                <div className="size-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-sm transition-transform group-hover:scale-105">
                    <span className="text-sm font-bold">S</span>
                </div>
                {!collapsed && (
                    <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        SmartTrack
                    </span>
                )}
            </Link>
        </div>

        {/* Navigation - No Dividers */}
        <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            isActive
                                ? "bg-zinc-200/50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-200/30 dark:hover:bg-zinc-900/50",
                        )}>
                        <item.icon
                            className={cn(
                                "size-4 shrink-0",
                                isActive ? "opacity-100" : "opacity-60",
                            )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                );
            })}
        </nav>

        {/* Sidebar Footer - Unified Surface */}
        {!isPro && !collapsed && (
            <div className="p-4 mt-auto">
                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 p-4">
                    <h4 className="text-xs font-semibold text-foreground">
                        Pro Plan
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                        Unlock advanced analytics and study tools.
                    </p>
                    <Button
                        size="sm"
                        className="w-full h-8 text-xs font-medium mt-3 transition-colors"
                        variant="outline"
                        asChild>
                        <Link href="/billing" onClick={onLinkClick}>
                            Upgrade
                        </Link>
                    </Button>
                </div>
            </div>
        )}
    </div>
);

export const AppLayout = ({ children, user, isPro }: AppLayoutProps) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-white dark:bg-zinc-950">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r border-zinc-200 dark:border-zinc-900 sticky top-0 h-screen transition-all duration-300 z-50",
                    isCollapsed ? "w-20" : "w-64",
                )}>
                <SidebarContent
                    collapsed={isCollapsed}
                    pathname={pathname}
                    user={user}
                    isPro={isPro}
                />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Header */}
                <header className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 lg:px-8 sticky top-0 z-40 transition-colors">
                    <div className="flex items-center gap-4">
                        <Sheet
                            open={isMobileOpen}
                            onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden hover:bg-zinc-100 dark:hover:bg-zinc-900">
                                    <PanelLeft className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="p-0 w-72 border-r border-zinc-200 dark:border-zinc-900">
                                <SidebarContent
                                    pathname={pathname}
                                    user={user}
                                    isPro={isPro}
                                    onLinkClick={() => setIsMobileOpen(false)}
                                />
                            </SheetContent>
                        </Sheet>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                            <ChevronLeft
                                className={cn(
                                    "size-4 transition-transform duration-300",
                                    isCollapsed && "rotate-180",
                                )}
                            />
                        </Button>

                        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:ml-2">
                            SmartTrack
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-8 rounded-full p-0 border border-zinc-200 dark:border-zinc-800 hover:ring-2 ring-zinc-100 dark:ring-zinc-900 transition-all">
                                    <Avatar className="size-full">
                                        <AvatarImage src={user?.image ?? ""} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-lg">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 p-4">
                                    Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    className="p-3 cursor-pointer text-sm font-medium"
                                    onClick={() => signOut()}>
                                    <LogOut className="mr-2 size-4 opacity-60" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full transition-all">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
