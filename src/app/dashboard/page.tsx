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
  TrendingUp,
  Award,
  Coffee,
} from "lucide-react";

// ── Mock data (will be replaced with real database data later) ──
const stats = [
  {
    title: "Today's Revenue",
    value: "₹12,450",
    change: "+18% from yesterday",
    icon: IndianRupee,
    trend: "up" as const,
  },
  {
    title: "Orders Today",
    value: "47",
    change: "+5 from yesterday",
    icon: ShoppingCart,
    trend: "up" as const,
  },
  {
    title: "Active Customers",
    value: "234",
    change: "12 new this week",
    icon: Users,
    trend: "up" as const,
  },
  {
    title: "Rewards Redeemed",
    value: "8",
    change: "3 pending",
    icon: Award,
    trend: "neutral" as const,
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    items: "Cappuccino, Croissant",
    amount: "₹320",
    time: "2 min ago",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    items: "Latte, Blueberry Muffin",
    amount: "₹280",
    time: "15 min ago",
    status: "completed",
  },
  {
    id: "ORD-003",
    customer: "Amit Kumar",
    items: "Espresso x2",
    amount: "₹200",
    time: "28 min ago",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Sneha Reddy",
    items: "Mocha, Sandwich",
    amount: "₹420",
    time: "45 min ago",
    status: "completed",
  },
  {
    id: "ORD-005",
    customer: "Vikram Singh",
    items: "Cold Brew",
    amount: "₹180",
    time: "1 hour ago",
    status: "completed",
  },
];

const topProducts = [
  { name: "Cappuccino", orders: 156, revenue: "₹23,400" },
  { name: "Latte", orders: 132, revenue: "₹19,800" },
  { name: "Espresso", orders: 98, revenue: "₹9,800" },
  { name: "Cold Brew", orders: 87, revenue: "₹15,660" },
  { name: "Croissant", orders: 76, revenue: "₹7,600" },
];

const loyaltyAlerts = [
  {
    customer: "Rahul Sharma",
    message: "1 coffee away from free drink!",
    progress: "5/6",
  },
  {
    customer: "Meera Joshi",
    message: "Reward ready to redeem",
    progress: "6/6",
  },
  {
    customer: "Arjun Nair",
    message: "Halfway to reward",
    progress: "3/6",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s what&apos;s happening at Cafe Sunshine
          today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Coffee className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best sellers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.orders} sold
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Alerts</CardTitle>
              <CardDescription>
                Customers close to rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loyaltyAlerts.map((alert) => (
                  <div
                    key={alert.customer}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{alert.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.message}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.progress === "6/6" ? "default" : "secondary"
                      }
                    >
                      {alert.progress}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
