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
import { format } from "date-fns";
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
    <div className="flex h-full flex-col bg-white dark:bg-[#0C0C0E]">
        <div className="flex h-14 items-center px-6 border-b border-border/40">
            <Link
                href="/dashboard"
                onClick={onLinkClick}
                className="flex items-center gap-3 font-bold tracking-tighter">
                <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-[10px]">
                    S
                </div>
                {!collapsed && (
                    <span className="text-sm uppercase tracking-widest">
                        SmartTrack
                    </span>
                )}
            </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            isActive
                                ? "bg-secondary text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        )}>
                        <item.icon
                            className={cn(
                                "size-4 shrink-0",
                                isActive ? "text-primary" : "opacity-70",
                            )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 border-t border-border/40 space-y-4">
            {!isPro && !collapsed && (
                <div className="rounded-xl bg-primary/5 border border-dashed border-primary/20 p-4">
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                        Pro Plan
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Unlock advanced analytics.
                    </p>
                    <Button
                        size="sm"
                        className="w-full h-8 text-[11px] font-bold"
                        variant="outline"
                        asChild>
                        <Link href="/billing" onClick={onLinkClick}>
                            Upgrade
                        </Link>
                    </Button>
                </div>
            )}

            <div
                className={cn(
                    "flex items-center gap-3 px-2",
                    collapsed && "justify-center",
                )}>
                <Avatar className="size-8 border border-border/40">
                    <AvatarImage src={user?.image ?? ""} />
                    <AvatarFallback className="text-[10px]">
                        {user?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                {!collapsed && (
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate">
                            {user?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                            {isPro ? "Premium" : "Free"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const AppLayout = ({ children, user, isPro }: AppLayoutProps) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <aside
                className={cn(
                    "hidden lg:flex flex-col border-r border-border/40 sticky top-0 h-screen transition-all duration-300",
                    isCollapsed ? "w-20" : "w-64",
                )}>
                <SidebarContent
                    collapsed={isCollapsed}
                    pathname={pathname}
                    user={user}
                    isPro={isPro}
                />
            </aside>

            <div className="flex flex-1 flex-col min-w-0">
                <header className="flex h-14 items-center justify-between border-b border-border/40 bg-white/60 dark:bg-[#0C0C0E]/60 backdrop-blur-xl px-4 lg:px-8 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Sheet
                            open={isMobileOpen}
                            onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden">
                                    <PanelLeft className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
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
                            className="hidden lg:flex"
                            onClick={() => setIsCollapsed(!isCollapsed)}>
                            <ChevronLeft
                                className={cn(
                                    "size-4 transition-transform",
                                    isCollapsed && "rotate-180",
                                )}
                            />
                        </Button>

                        <h2 className="text-sm font-bold tracking-tight text-foreground/80 lg:ml-2">
                            SmartTrack
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 hidden sm:block">
                            {format(new Date(), "EEEE, MMM do")}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="size-8 rounded-full p-0 border border-border/40">
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
                                className="w-56 rounded-xl">
                                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 p-4">
                                    Account
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    className="p-3 cursor-pointer"
                                    onClick={() => signOut()}>
                                    <LogOut className="mr-2 size-4" />
                                    <span className="text-sm font-medium">
                                        Sign out
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
