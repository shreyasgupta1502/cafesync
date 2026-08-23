import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, UserPlus, IndianRupee, Search } from "lucide-react";

const summaryStats = [
  { label: "Total Customers", value: "234", icon: Users, accent: "#6f4e37" },
  { label: "Active This Month", value: "89", icon: UserCheck, accent: "#16a34a" },
  { label: "New This Week", value: "12", icon: UserPlus, accent: "#d97706" },
  { label: "Avg Spend", value: "₹285", icon: IndianRupee, accent: "#d4a76a" },
];

const customers = [
  { name: "Rahul Sharma", email: "rahul@email.com", visits: 45, spent: "₹12,600", fav: "Cappuccino", loyalty: 5, target: 6, lastVisit: "2 days ago", segment: "Regular" },
  { name: "Priya Patel", email: "priya@email.com", visits: 32, spent: "₹9,800", fav: "Latte", loyalty: 2, target: 6, lastVisit: "5 days ago", segment: "Regular" },
  { name: "Amit Kumar", email: "amit@email.com", visits: 8, spent: "₹2,100", fav: "Espresso", loyalty: 2, target: 6, lastVisit: "12 days ago", segment: "Inactive" },
  { name: "Sneha Reddy", email: "sneha@email.com", visits: 67, spent: "₹28,400", fav: "Mocha", loyalty: 6, target: 6, lastVisit: "1 day ago", segment: "High Value" },
  { name: "Vikram Singh", email: "vikram@email.com", visits: 3, spent: "₹540", fav: "Cold Brew", loyalty: 3, target: 6, lastVisit: "8 days ago", segment: "New" },
  { name: "Meera Joshi", email: "meera@email.com", visits: 28, spent: "₹7,200", fav: "Masala Chai", loyalty: 4, target: 6, lastVisit: "3 days ago", segment: "Regular" },
];

const avatarColors = ["#6f4e37", "#d97706", "#16a34a", "#d4a76a", "#a0845c", "#c4956a"];

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function segmentStyle(segment: string) {
  switch (segment) {
    case "High Value": return "bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20";
    case "Inactive": return "bg-destructive/10 text-destructive border-destructive/20";
    case "New": return "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20";
    default: return "bg-primary/10 text-primary border-primary/20";
  }
}

function LoyaltyBar({ current, target }: { current: number; target: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: target }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-4 rounded-sm ${i < current ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">Track your customers, their preferences, and loyalty progress</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} style={{ borderLeft: `4px solid ${stat.accent}` }}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${stat.accent}1a` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search customers..." className="pl-9" />
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>Click on a customer to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {customers.map((c, index) => (
              <div
                key={c.email}
                className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                {/* Avatar */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                >
                  {initials(c.name)}
                </div>

                {/* Name & Email */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>

                {/* Visits */}
                <div className="hidden sm:block text-center min-w-[60px]">
                  <p className="text-sm font-semibold">{c.visits}</p>
                  <p className="text-[11px] text-muted-foreground">visits</p>
                </div>

                {/* Spent */}
                <div className="hidden sm:block text-center min-w-[70px]">
                  <p className="text-sm font-semibold">{c.spent}</p>
                  <p className="text-[11px] text-muted-foreground">spent</p>
                </div>

                {/* Favorite */}
                <div className="hidden md:block text-center min-w-[90px]">
                  <p className="text-sm">☕ {c.fav}</p>
                </div>

                {/* Loyalty */}
                <div className="hidden lg:flex flex-col items-center gap-1 min-w-[80px]">
                  <LoyaltyBar current={c.loyalty} target={c.target} />
                  <p className="text-[11px] text-muted-foreground">{c.loyalty}/{c.target}</p>
                </div>

                {/* Last Visit */}
                <div className="hidden md:block text-center min-w-[80px]">
                  <p className="text-xs text-muted-foreground">{c.lastVisit}</p>
                </div>

                {/* Segment */}
                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${segmentStyle(c.segment)}`}>
                  {c.segment}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
