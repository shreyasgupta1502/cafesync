import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, IndianRupee, TrendingUp } from "lucide-react";

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? "s" : ""} ago`;
}

export default async function OrdersPage() {
  const supabase = await createClient();

  // Get today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("cafe_id", DEMO_CAFE_ID)
    .gte("created_at", today.toISOString());

  const todayRevenue = todayOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const todayOrderCount = todayOrders?.length ?? 0;
  const avgOrderValue = todayOrderCount > 0 ? Math.round(todayRevenue / todayOrderCount) : 0;

  // Get recent orders with details
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      status,
      created_at,
      profiles!inner(full_name),
      order_items(product_name, quantity)
    `)
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("created_at", { ascending: false })
    .limit(20);

  const summaryStats = [
    { label: "Today's Orders", value: todayOrderCount.toString(), icon: ShoppingCart, accent: "#d97706" },
    { label: "Revenue", value: `₹${todayRevenue.toLocaleString()}`, icon: IndianRupee, accent: "#6f4e37" },
    { label: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString()}`, icon: TrendingUp, accent: "#16a34a" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>All orders from your cafe</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {orders?.map((order, i) => {
              const customerName = (order.profiles as any)?.full_name ?? "Guest";
              const items = (order.order_items as any[])
                ?.map((item) => `${item.product_name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`)
                .join(", ") ?? "—";

              return (
                <div key={order.id}>
                  <div className="flex items-center gap-4 py-4 px-2 hover:bg-secondary/30 rounded-lg transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {initials(customerName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <code className="text-xs font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
                          #{order.order_number ?? order.id.slice(0, 8)}
                        </code>
                        <span className="text-sm font-semibold">{customerName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{items}</p>
                    </div>

                    <p className="text-sm font-bold text-primary">₹{Number(order.total_amount).toLocaleString()}</p>

                    <p className="text-xs text-muted-foreground min-w-[80px] text-right">
                      {getRelativeTime(order.created_at)}
                    </p>

                    <span className="shrink-0 rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  {i < (orders?.length ?? 0) - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
