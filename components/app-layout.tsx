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
  ChevronsUpDown,
  CreditCard,
  ArrowUpRight,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { User } from "next-auth";

interface AppLayoutProps {
  children: React.ReactNode;
  user: User;
  isPro: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Schedule", href: "/calendar", icon: CalendarDays },
  { label: "Smart Planner", href: "/planner", icon: Sparkles },
  { label: "Habit Tracker", href: "/habits", icon: ListTodo },
  { label: "Academic", href: "/exams", icon: GraduationCap },
  { label: "Deep Work", href: "/focus", icon: Timer },
  { label: "Billing", href: "/billing", icon: Settings2 },
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
    <div className="flex h-full flex-col bg-[#121110] text-[#F9F8F6] select-none">
      {/* Brand & Collapse Header */}
      <div
        className={cn(
          "flex h-16 w-full shrink-0 items-center border-b border-[#F9F8F6]/[0.06] transition-all",
          collapsed ? "justify-center px-0" : "justify-between px-4"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-2.5 group"
        >
          <Logo className="size-6 shrink-0 transition-transform group-hover:scale-105" />
          {!collapsed && (
            <span className="font-serif text-lg tracking-[-0.02em] font-normal text-[#F9F8F6]">
              SmartTrack
            </span>
          )}
        </Link>

        {!collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Collapse sidebar"
            className="size-7 rounded-[6px] text-[#F9F8F6]/40 hover:text-[#F9F8F6] hover:bg-[#20201F]"
            onClick={onToggleCollapse}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-[8px] text-[13.5px] font-sans font-medium transition-colors relative",
                collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                isActive
                  ? "bg-[#20201F] text-[#F9F8F6] border border-[#F9F8F6]/[0.08]"
                  : "text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#161616]"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive ? "text-[#F9F8F6]" : "text-[#F9F8F6]/50"
                )}
              />
              {!collapsed && <span>{item.label}</span>}

            </Link>
          );
        })}
      </nav>

      {/* Footer Area: Pro Trigger & Profile */}
      <div className="mt-auto flex w-full flex-col gap-3 p-3 border-t border-[#F9F8F6]/[0.06]">
        {/* Pro Callout Card (Visible for Free users when expanded) */}
        {!isPro && !collapsed && (
          <Link
            href="/billing"
            onClick={onLinkClick}
            className="group rounded-[10px] bg-[#161616] border border-[#F9F8F6]/[0.08] p-3 hover:border-[#F9F8F6]/20 transition-colors block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#F9F8F6]">
                <Sparkles className="size-3 text-[#66CC63]" />
                <span>PRO UPGRADE</span>
              </div>
              <ArrowUpRight className="size-3 text-[#F9F8F6]/40 group-hover:text-[#F9F8F6] transition-colors" />
            </div>
            <p className="text-[11px] font-sans text-[#F9F8F6]/50 mt-1 leading-tight">
              Unlock unmetered tasks, cloud sync & AI pacing.
            </p>
          </Link>
        )}

        {/* User Identity Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[8px] p-2 transition-colors hover:bg-[#161616] text-left outline-none",
                collapsed ? "justify-center p-1.5" : ""
              )}
            >
              <Avatar className="size-8 rounded-[6px] shrink-0 border border-[#F9F8F6]/[0.1]">
                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
                <AvatarFallback className="text-xs font-mono font-medium bg-[#20201F] text-[#F9F8F6]">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <>
                  <div className="flex flex-1 flex-col min-w-0 pr-1">
                    <span className="truncate text-xs font-sans font-medium text-[#F9F8F6]">
                      {user?.name || "Workspace User"}
                    </span>
                    <span className="text-[11px] font-mono text-[#F9F8F6]/40 truncate">
                      {isPro ? "PRO SUBSCRIBER" : "FREE TIER"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-3.5 text-[#F9F8F6]/40 shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={collapsed ? "right" : "top"}
            align={collapsed ? "end" : "start"}
            sideOffset={8}
            className="w-56 rounded-[8px] border border-[#F9F8F6]/[0.06] bg-[#161616] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-[#F9F8F6] outline-none"
          >
            {/* User Identity Header */}
            <div className="flex flex-col min-w-0 px-2.5 py-2 select-none">
              <span className="text-xs font-sans font-medium truncate text-[#F9F8F6]">
                {user?.name || "User"}
              </span>
              <span className="text-[11px] font-mono text-[#F9F8F6]/40 truncate mt-0.5">
                {user?.email}
              </span>
            </div>

            <DropdownMenuSeparator className="bg-[#F9F8F6]/[0.06] -mx-1 my-1" />

            {/* Refined Sign Out Action */}
            <DropdownMenuItem
              className="cursor-pointer text-xs font-sans text-[#F9F8F6]/60 hover:text-[#F87171] focus:text-[#F87171] hover:bg-[#B42318]/10 focus:bg-[#B42318]/15 flex items-center px-2.5 py-1.5 rounded-[6px] transition-colors outline-none"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="size-3.5 mr-2 text-current opacity-70" />
              Sign Out
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

  const activeNav = navItems.find((item) =>
    pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
  );

  const pageTitle = activeNav
    ? activeNav.label
    : pathname.includes("/billing")
      ? "Membership & Billing"
      : "Workspace";

  return (
    <div className="flex min-h-screen bg-[#0E0D0C] text-[#F9F8F6] antialiased">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-[#F9F8F6]/[0.06] sticky top-0 h-screen transition-all duration-200 ease-out z-30 shrink-0",
          isCollapsed ? "w-16" : "w-60"
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

      {/* Main Viewport Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-[#F9F8F6]/[0.06] bg-[#0E0D0C]/80 backdrop-blur-md px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Navigation Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Open navigation menu"
                  className="lg:hidden text-[#F9F8F6]/60 hover:text-[#F9F8F6] hover:bg-[#20201F]"
                >
                  <PanelLeft className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-64 bg-[#121110] border-r border-[#F9F8F6]/[0.08]"
              >
                <SheetTitle className="sr-only">Workspace Navigation Menu</SheetTitle>
                <SidebarContent
                  pathname={pathname}
                  user={user}
                  isPro={isPro}
                  onLinkClick={() => setIsMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {/* Desktop Expand Action (Visible when sidebar collapsed) */}
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Expand sidebar"
                className="hidden lg:flex text-[#F9F8F6]/60 hover:text-[#F9F8F6] size-7 rounded-[6px] hover:bg-[#20201F]"
                onClick={() => setIsCollapsed(false)}
              >
                <PanelLeft className="size-4" />
              </Button>
            )}

            {/* Route Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#F9F8F6]/40 hidden sm:inline">WORKSPACE</span>
              <span className="text-[#F9F8F6]/20 hidden sm:inline">/</span>
              <h2 className="text-[#F9F8F6] font-medium tracking-tight">
                {pageTitle.toUpperCase()}
              </h2>
            </div>
          </div>

          {/* Right Header Status Widget */}
          <div className="flex items-center gap-3">
            {isPro ? (
              <span className="text-[10px] font-mono tracking-wider text-[#66CC63] bg-[#66CC63]/10 px-2 py-0.5 rounded-[4px] border border-[#66CC63]/20">
                PRO ACTIVE
              </span>
            ) : (
              <Link
                href="/billing"
                className="text-[10px] font-mono tracking-wider text-[#F9F8F6]/60 hover:text-[#F9F8F6] bg-[#161616] px-2 py-0.5 rounded-[4px] border border-[#F9F8F6]/[0.08] transition-colors"
              >
                FREE PLAN
              </Link>
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
