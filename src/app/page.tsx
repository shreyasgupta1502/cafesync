import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, BarChart3, Users, Brain, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Coffee className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CafeSync</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/menu">
              <Button variant="ghost" className="text-sm">View Menu</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="text-sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            <Sparkles className="h-4 w-4" />
            AI-Powered Cafe Management
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Your cafe, <br />
            <span className="text-primary">smarter than ever</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Manage customers, track loyalty, and grow your business with
            intelligent insights. CafeSync uses AI to understand your
            customers and keep them coming back.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/menu">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                Browse Menu <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                Owner Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Coffee,
              title: "Menu & Orders",
              desc: "Beautiful menu, easy ordering, real-time tracking",
            },
            {
              icon: Users,
              title: "Loyalty Program",
              desc: "Reward your regulars, configurable loyalty rules",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Revenue, trends, popular items at a glance",
            },
            {
              icon: Brain,
              title: "AI Agent",
              desc: "Smart campaigns and customer insights on autopilot",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 text-center space-y-3 transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground bg-card/50">
        <div className="flex items-center justify-center gap-2">
          <Coffee className="h-4 w-4" />
          <span>CafeSync — Brewed with AI</span>
        </div>
      </footer>
    </div>
  );
}
