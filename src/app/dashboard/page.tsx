import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Award,
  Coffee,
} from "lucide-react";
import { RevenueChart, OrdersChart } from "@/components/charts";

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function LoyaltyDots({ current, target }: { current: number; target: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: target }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < current ? "bg-warning" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("cafe_id", DEMO_CAFE_ID)
    .gte("created_at", today.toISOString());

  const todayRevenue = todayOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;
  const todayOrderCount = todayOrders?.length ?? 0;

  // Get total active customers (have ordered in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeCustomers } = await supabase
    .from("orders")
    .select("customer_id", { count: "exact", head: true })
    .eq("cafe_id", DEMO_CAFE_ID)
    .gte("created_at", thirtyDaysAgo.toISOString());

  // Get rewards redeemed today (simplified: rewards earned)
  const { data: loyaltyData } = await supabase
    .from("loyalty_progress")
    .select("rewards_earned")
    .gt("rewards_earned", 0);

  const totalRewards = loyaltyData?.reduce((sum, l) => sum + l.rewards_earned, 0) ?? 0;

  // Get recent orders with customer info
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      created_at,
      profiles!inner(full_name),
      order_items(product_name)
    `)
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get top products (most ordered)
  const { data: topProductsData } = await supabase
    .from("order_items")
    .select("product_name")
    .limit(1000);

  const productCounts: Record<string, number> = {};
  topProductsData?.forEach((item) => {
    productCounts[item.product_name] = (productCounts[item.product_name] || 0) + 1;
  });

  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, orders: count }));

  const maxOrders = topProducts[0]?.orders ?? 1;

  // Get last 7 days data for charts
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: last7DaysOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("cafe_id", DEMO_CAFE_ID)
    .gte("created_at", sevenDaysAgo.toISOString());

  // Process data for charts
  const dailyData: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    dailyData[dateStr] = { revenue: 0, orders: 0 };
  }

  last7DaysOrders?.forEach((order) => {
    const date = new Date(order.created_at);
    const dateStr = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    if (dailyData[dateStr]) {
      dailyData[dateStr].revenue += Number(order.total_amount);
      dailyData[dateStr].orders += 1;
    }
  });

  const chartData = Object.entries(dailyData).map(([date, data]) => ({
    date,
    revenue: Math.round(data.revenue),
    orders: data.orders,
  }));

  // Get loyalty alerts (customers close to rewards)
  const { data: loyaltyAlerts } = await supabase
    .from("loyalty_progress")
    .select(`
      current_count,
      profiles!inner(full_name),
      loyalty_programs!inner(target_count)
    `)
    .gte("current_count", 3)
    .order("current_count", { ascending: false })
    .limit(3);

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      change: `${todayOrderCount} orders`,
      icon: IndianRupee,
      accent: "#6f4e37",
    },
    {
      title: "Orders Today",
      value: todayOrderCount.toString(),
      change: "from customers",
      icon: ShoppingCart,
      accent: "#d97706",
    },
    {
      title: "Active Customers",
      value: (activeCustomers ?? 0).toString(),
      change: "last 30 days",
      icon: Users,
      accent: "#16a34a",
    },
    {
      title: "Total Rewards Earned",
      value: totalRewards.toString(),
      change: "lifetime",
      icon: Award,
      accent: "#d4a76a",
    },
  ];

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Good morning! Here&apos;s your cafe overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} style={{ borderLeft: `4px solid ${stat.accent}` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${stat.accent}1a` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.accent }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersChart data={chartData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentOrders?.map((order) => {
                const customerName = (order.profiles as any)?.full_name ?? "Guest";
                const items = (order.order_items as any[])?.map((i) => i.product_name).join(", ") ?? "—";
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {initials(customerName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customerName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{items}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₹{order.total_amount}</p>
                      <p className="text-xs text-muted-foreground">{getRelativeTime(order.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best sellers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="text-muted-foreground">{product.orders}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(product.orders / maxOrders) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Alerts</CardTitle>
              <CardDescription>Customers close to rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loyaltyAlerts?.map((alert, i) => {
                  const customerName = (alert.profiles as any)?.full_name ?? "Customer";
                  const target = (alert.loyalty_programs as any)?.target_count ?? 6;
                  const current = alert.current_count;
                  const remaining = target - current;
                  
                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-border p-3"
                      style={{ backgroundColor: "#d4a76a10" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{customerName}</p>
                        <Badge variant={current >= target ? "default" : "secondary"}>
                          {current}/{target}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {remaining === 0
                          ? "Reward ready!"
                          : `${remaining} ${remaining === 1 ? "coffee" : "coffees"} away from reward`}
                      </p>
                      <LoyaltyDots current={current} target={target} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
