"use client";

import {
    CalendarDays,
    GraduationCap,
    LayoutDashboard,
    ListTodo,
    Menu,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
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
};

const SidebarContent = ({ onNavigate }: SidebarContentProps) => {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-b border-sidebar-border px-4 py-5">
                <BrandMark
                    href="/dashboard"
                    showTagline
                    variant="sidebar"
                />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
                <NavLinks onNavigate={onNavigate} />
            </div>

            <div className="border-t border-sidebar-border px-4 py-4">
                <ModeToggle />
            </div>
        </div>
    );
};

type AppLayoutProps = {
    children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
                <SidebarContent />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:hidden">
                    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
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
                                onNavigate={() => setMobileNavOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>

                    <BrandMark
                        href="/dashboard"
                        showTagline
                        size="sm"
                        variant="sidebar"
                    />
                </header>

                <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
            </div>
        </div>
    );
};
