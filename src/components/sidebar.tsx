"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Coffee,
  Users,
  ClipboardList,
  Megaphone,
  Brain,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Menu", href: "/dashboard/menu", icon: Coffee },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { label: "Promotions", href: "/dashboard/promotions", icon: Megaphone },
  { label: "AI Insights", href: "/dashboard/ai-insights", icon: Brain },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Coffee className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <span className="text-lg font-bold text-sidebar-foreground">
            CafeSync
          </span>
          <p className="text-[11px] text-sidebar-foreground/50 -mt-0.5">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Main
        </p>
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-sidebar-primary")} />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 mt-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Intelligence
        </p>
        {navItems.slice(5).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-sidebar-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Cafe Info */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            CS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              Cafe Sunshine
            </p>
            <p className="text-[11px] text-sidebar-foreground/50 truncate">MG Road, Bangalore</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
