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
  PanelLeft,
  PanelLeftClose,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  onToggleCollapse,
}: {
  collapsed?: boolean;
  pathname: string;
  user: User;
  isPro: boolean;
  onLinkClick?: () => void;
  onToggleCollapse?: () => void;
}) => (
  <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-200">
    {/* Continuous Brand Header */}
    <div
      className={cn(
        "pt-5 pb-4 flex items-center transition-all",
        collapsed ? "justify-center px-2" : "justify-between px-5",
      )}
    >
      <Link
        href="/dashboard"
        onClick={onLinkClick}
        className="flex items-center gap-3 group"
      >
        <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0">
          <span className="text-sm tracking-tight">S</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-foreground leading-none">
              SmartTrack
            </span>
            <span className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase font-medium">
              {isPro ? "Pro Edition" : "Workspace"}
            </span>
          </div>
        )}
      </Link>

      {/* Desktop Collapse Trigger (Inside Sidebar Header) */}
      {!collapsed && onToggleCollapse && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="hidden lg:flex text-muted-foreground hover:text-foreground size-7 rounded-md hover:bg-sidebar-accent"
          onClick={onToggleCollapse}
        >
          <PanelLeftClose className="size-4" />
        </Button>
      )}
    </div>

    {/* Navigation Items */}
    <nav className="flex-1 px-3 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 relative",
              collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold card-elevation"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
            )}
          >
            {isActive && !collapsed && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-500" />
            )}
            <item.icon
              className={cn(
                "size-4.5 shrink-0 transition-colors",
                isActive
                  ? "text-emerald-500 opacity-100"
                  : "opacity-70 group-hover:opacity-100",
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>

    {/* Sidebar Footer: Tier Status */}
    {!collapsed && (
      <div className="p-3.5 mt-auto">
        {!isPro && pathname !== "/billing" ? (
          <div className="rounded-xl bg-card border border-border p-3.5 card-elevation">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-emerald-500" />
                Pro Plan
              </span>
              <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md">
                $9/mo
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
              Unlock dynamic planner, calendar sync & deep analytics.
            </p>
            <Button
              size="sm"
              className="w-full h-8 text-xs font-medium mt-3 btn-tactile bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <Link href="/billing" onClick={onLinkClick}>
                Upgrade to Pro
              </Link>
            </Button>
          </div>
        ) : isPro ? (
          <div className="rounded-lg bg-card/60 border border-border px-3 py-2 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-foreground truncate">
                Pro Member
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                All features unlocked
              </span>
            </div>
          </div>
        ) : null}
      </div>
    )}
  </div>
);

export const AppLayout = ({ children, user, isPro }: AppLayoutProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeNav = navItems.find((item) => item.href === pathname);
  const pageTitle = activeNav
    ? activeNav.label
    : pathname.includes("/billing")
      ? "Membership & Billing"
      : "Overview";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border sticky top-0 h-screen transition-all duration-300 z-30 shrink-0",
          isCollapsed ? "w-18" : "w-60",
        )}
      >
        <SidebarContent
          collapsed={isCollapsed}
          pathname={pathname}
          user={user}
          isPro={isPro}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </aside>

      {/* Main Application Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Global Unified Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                >
                  <PanelLeft className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-64 bg-sidebar border-r border-sidebar-border"
              >
                <SidebarContent
                  pathname={pathname}
                  user={user}
                  isPro={isPro}
                  onLinkClick={() => setIsMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Expand Button (Only shown when collapsed) */}
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="hidden lg:flex text-muted-foreground hover:text-foreground size-8 rounded-md"
                onClick={() => setIsCollapsed(false)}
              >
                <PanelLeft className="size-4" />
              </Button>
            )}

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground font-normal hidden sm:inline">
                SmartTrack
              </span>
              <span className="text-muted-foreground/40 hidden sm:inline">
                /
              </span>
              <h1 className="font-semibold text-foreground tracking-tight text-sm">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label="User account menu"
                  className="size-8 rounded-full p-0 border border-border/80 hover:ring-2 ring-border transition-all"
                >
                  <Avatar className="size-full">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? "User"}
                    />
                    <AvatarFallback className="text-xs bg-sidebar-accent text-foreground font-medium">
                      {user?.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border border-border bg-popover p-1.5 shadow-xl"
              >
                <div className="flex flex-col min-w-0 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate text-foreground leading-none">
                      {user?.name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded",
                        isPro
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isPro ? "PRO" : "FREE"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate mt-1.5 leading-none">
                    {user?.email}
                  </span>
                </div>
                <DropdownMenuSeparator className="bg-border my-1" />

                <DropdownMenuItem
                  asChild
                  className="cursor-pointer text-xs font-medium"
                >
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5"
                  >
                    <Globe className="size-4 opacity-75" />
                    Public Website
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-xs font-medium text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-4 opacity-75 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
