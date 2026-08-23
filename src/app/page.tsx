import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, BarChart3, Users, Brain, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CafeSync</span>
          </div>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            AI-Powered Cafe Management
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Manage your customers, menu, orders, and loyalty programs.
            Get AI-powered insights and automated customer engagement.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Coffee,
              title: "Menu & Orders",
              desc: "Manage your menu and track all orders in real time",
            },
            {
              icon: Users,
              title: "Customers & Loyalty",
              desc: "Track customer preferences and run loyalty programs",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Revenue trends, popular products, and customer insights",
            },
            {
              icon: Brain,
              title: "AI Insights",
              desc: "AI-powered recommendations and automated campaigns",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border p-6 text-center space-y-3"
            >
              <feature.icon className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        CafeSync — AI-Powered Cafe Management Platform
      </footer>
    </div>
  );
}
