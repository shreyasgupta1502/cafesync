import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, UserCheck, UserPlus, IndianRupee, Search } from "lucide-react";

const avatarColors = ["#6f4e37", "#d97706", "#16a34a", "#d4a76a", "#a0845c", "#c4956a"];

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function getColorFromName(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
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

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export default async function CustomersPage() {
  const supabase = await createClient();

  // Get all customers with their stats
  const { data: customers } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      created_at,
      orders(id, total_amount, created_at, order_items(product_name))
    `)
    .eq("cafe_id", DEMO_CAFE_ID)
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  // Get loyalty progress for all customers
  const { data: loyaltyData } = await supabase
    .from("loyalty_progress")
    .select("customer_id, current_count, loyalty_programs!inner(target_count)");

  const loyaltyMap = new Map(
    loyaltyData?.map((l) => [
      l.customer_id,
      { current: l.current_count, target: (l.loyalty_programs as any)?.target_count ?? 6 },
    ])
  );

  // Process customer data
  const processedCustomers = customers?.map((customer) => {
    const orders = customer.orders ?? [];
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const lastOrder = orders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    // Find favorite item (most ordered)
    const productCounts: Record<string, number> = {};
    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        productCounts[item.product_name] = (productCounts[item.product_name] || 0) + 1;
      });
    });
    const favoriteItem = Object.entries(productCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";

    // Determine segment
    const daysSinceLastOrder = lastOrder
      ? Math.floor((Date.now() - new Date(lastOrder.created_at).getTime()) / 86400000)
      : 999;
    
    let segment = "Regular";
    if (orders.length <= 5) segment = "New";
    else if (totalSpent > 15000) segment = "High Value";
    else if (daysSinceLastOrder > 14) segment = "Inactive";

    const loyalty = loyaltyMap.get(customer.id) ?? { current: 0, target: 6 };

    return {
      id: customer.id,
      name: customer.full_name,
      email: customer.email ?? "",
      visits: orders.length,
      spent: totalSpent,
      favoriteItem,
      loyaltyCurrent: loyalty.current,
      loyaltyTarget: loyalty.target,
      lastVisit: lastOrder ? getRelativeTime(lastOrder.created_at) : "never",
      segment,
    };
  }) ?? [];

  // Calculate summary stats
  const totalCustomers = processedCustomers.length;
  const activeCustomers = processedCustomers.filter((c) => c.lastVisit !== "never" && !c.lastVisit.includes("month")).length;
  const newCustomers = processedCustomers.filter((c) => c.segment === "New").length;
  const avgSpend = totalCustomers > 0 
    ? Math.round(processedCustomers.reduce((sum, c) => sum + c.spent, 0) / totalCustomers)
    : 0;

  const summaryStats = [
    { label: "Total Customers", value: totalCustomers.toString(), icon: Users, accent: "#6f4e37" },
    { label: "Active This Month", value: activeCustomers.toString(), icon: UserCheck, accent: "#16a34a" },
    { label: "New This Week", value: newCustomers.toString(), icon: UserPlus, accent: "#d97706" },
    { label: "Avg Spend", value: `₹${avgSpend.toLocaleString()}`, icon: IndianRupee, accent: "#d4a76a" },
  ];

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
            {processedCustomers.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-secondary/50 cursor-pointer"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: getColorFromName(c.name) }}
                >
                  {initials(c.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>

                <div className="hidden sm:block text-center min-w-[60px]">
                  <p className="text-sm font-semibold">{c.visits}</p>
                  <p className="text-[11px] text-muted-foreground">visits</p>
                </div>

                <div className="hidden sm:block text-center min-w-[70px]">
                  <p className="text-sm font-semibold">₹{c.spent.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground">spent</p>
                </div>

                <div className="hidden md:block text-center min-w-[90px]">
                  <p className="text-sm">☕ {c.favoriteItem}</p>
                </div>

                <div className="hidden lg:flex flex-col items-center gap-1 min-w-[80px]">
                  <LoyaltyBar current={c.loyaltyCurrent} target={c.loyaltyTarget} />
                  <p className="text-[11px] text-muted-foreground">{c.loyaltyCurrent}/{c.loyaltyTarget}</p>
                </div>

                <div className="hidden md:block text-center min-w-[80px]">
                  <p className="text-xs text-muted-foreground">{c.lastVisit}</p>
                </div>

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
