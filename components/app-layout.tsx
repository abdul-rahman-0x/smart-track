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
  Globe,
  ChevronsUpDown,
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
import { Logo } from "@/components/logo";
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
}) => {
  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-200">
      {/* Grok-Style Header: Brand on left, Collapse Toggle on right */}
      <div
        className={cn(
          "relative flex h-14 w-full shrink-0 items-center justify-between px-3 transition-all",
          collapsed ? "justify-center px-0" : "px-3.5",
        )}
      >
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-2.5 group"
        >
          <Logo className="size-6 shrink-0 transition-transform group-hover:scale-105" />
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-foreground">
              SmartTrack
            </span>
          )}
        </Link>

        {/* Collapse Sidebar Button (Exact Grok placement) */}
        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Collapse sidebar"
            className="size-7 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      {/* Navigation Items (Spaced & Clean) */}
      <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg text-xs font-medium transition-colors relative",
                collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Grok-Style Footer */}
      <div className="mt-auto flex w-full flex-col gap-2 p-2.5 border-t border-sidebar-border/60">
        {/* Sleek Upgrade Pill (Only shown for Free users when expanded) */}
        {!isPro && !collapsed && pathname !== "/billing" && (
          <Link
            href="/billing"
            onClick={onLinkClick}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 transition-colors text-xs font-medium"
          >
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="size-3.5 shrink-0" />
              <span className="truncate">Upgrade to Pro</span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
              $9/mo
            </span>
          </Link>
        )}

        {/* User Identity Profile Trigger (1:1 with Grok Dom Structure) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full select-none items-center gap-2.5 rounded-lg py-1.5 transition-colors hover:bg-sidebar-accent text-left focus:outline-hidden",
                collapsed ? "justify-center px-0" : "px-2",
              )}
            >
              <Avatar className="size-7 rounded-full shrink-0 border border-border/80">
                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
                <AvatarFallback className="text-[11px] font-semibold bg-secondary text-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <>
                  <div className="flex flex-1 flex-col min-w-0 pr-1">
                    <span className="truncate text-xs font-medium text-foreground leading-snug">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-none">
                      {isPro ? "Pro Member" : "Free"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={collapsed ? "right" : "top"}
            align={collapsed ? "end" : "start"}
            className="w-56 rounded-xl border border-border bg-popover p-1.5 shadow-xl mb-1"
          >
            <div className="flex flex-col min-w-0 px-2.5 py-2">
              <span className="text-xs font-semibold truncate text-foreground leading-none">
                {user?.name}
              </span>
              <span className="text-[11px] text-muted-foreground truncate mt-1 leading-none">
                {user?.email}
              </span>
            </div>

            <DropdownMenuSeparator className="bg-border my-1" />

            <DropdownMenuItem asChild className="cursor-pointer text-xs font-medium">
              <Link href="/billing" className="flex items-center gap-2">
                <Settings2 className="size-3.5 text-muted-foreground" />
                Account Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer text-xs font-medium">
              <Link href="/" target="_blank" className="flex items-center gap-2">
                <Globe className="size-3.5 text-muted-foreground" />
                Public Website
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border my-1" />

            <DropdownMenuItem
              className="cursor-pointer text-xs font-medium text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

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
      {/* Desktop Sidebar (Smooth Grok-style width transition) */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border sticky top-0 h-screen transition-all duration-200 ease-out z-30 shrink-0",
          isCollapsed ? "w-16" : "w-60",
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

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar: Minimal & Distraction-Free */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
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

            {/* Desktop Expand Button (Shown only when sidebar is collapsed) */}
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Expand sidebar"
                className="hidden lg:flex text-muted-foreground hover:text-foreground size-7 rounded-md"
                onClick={() => setIsCollapsed(false)}
              >
                <PanelLeft className="size-4" />
              </Button>
            )}

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground font-normal hidden sm:inline">
                SmartTrack
              </span>
              <span className="text-muted-foreground/40 hidden sm:inline">/</span>
              <h1 className="font-semibold text-foreground tracking-tight text-xs">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
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
