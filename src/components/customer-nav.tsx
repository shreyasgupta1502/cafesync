"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Coffee, ShoppingBag, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Menu", href: "/menu", icon: Coffee },
  { label: "My Orders", href: "/orders", icon: ShoppingBag, requiresAuth: true },
  { label: "Loyalty", href: "/loyalty", icon: Award, requiresAuth: true },
];

export function CustomerNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", authUser.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({ name: profile.full_name, email: profile.email || authUser.email || "" });
            }
          });
      }
      setLoading(false);
    });
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "G";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/menu" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Coffee className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">Cafe Sunshine</span>
            <p className="text-[11px] text-muted-foreground -mt-0.5">by CafeSync</p>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {navItems
            .filter((item) => !item.requiresAuth || user)
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          
          {/* Auth section */}
          {!loading && (
            <>
              {user ? (
                <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {initials}
                </div>
              ) : (
                <div className="ml-2 flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="text-xs h-8">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
