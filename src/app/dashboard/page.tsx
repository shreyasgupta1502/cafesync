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

const stats = [
  {
    title: "Today's Revenue",
    value: "₹12,450",
    change: "+18% from yesterday",
    icon: IndianRupee,
    accent: "#6f4e37",
  },
  {
    title: "Orders Today",
    value: "47",
    change: "+5 from yesterday",
    icon: ShoppingCart,
    accent: "#d97706",
  },
  {
    title: "Active Customers",
    value: "234",
    change: "12 new this week",
    icon: Users,
    accent: "#16a34a",
  },
  {
    title: "Rewards Redeemed",
    value: "8",
    change: "3 pending",
    icon: Award,
    accent: "#d4a76a",
  },
];

const recentOrders = [
  { customer: "Rahul Sharma", items: "Cappuccino, Croissant", amount: "₹320", time: "2 min ago" },
  { customer: "Priya Patel", items: "Latte, Blueberry Muffin", amount: "₹280", time: "15 min ago" },
  { customer: "Amit Kumar", items: "Espresso x2", amount: "₹200", time: "28 min ago" },
  { customer: "Sneha Reddy", items: "Mocha, Sandwich", amount: "₹420", time: "45 min ago" },
  { customer: "Vikram Singh", items: "Cold Brew", amount: "₹180", time: "1 hour ago" },
];

const topProducts = [
  { name: "Cappuccino", orders: 156 },
  { name: "Latte", orders: 132 },
  { name: "Espresso", orders: 98 },
  { name: "Cold Brew", orders: 87 },
  { name: "Croissant", orders: 76 },
];

const loyaltyAlerts = [
  { customer: "Rahul Sharma", message: "1 coffee away from free drink!", current: 5, target: 6 },
  { customer: "Meera Joshi", message: "Reward ready to redeem", current: 6, target: 6 },
  { customer: "Arjun Nair", message: "Halfway to reward", current: 3, target: 6 },
];

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

export default function DashboardPage() {
  const maxOrders = topProducts[0].orders;

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentOrders.map((order, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {initials(order.customer)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.items}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                </div>
              ))}
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
                {loyaltyAlerts.map((alert) => (
                  <div
                    key={alert.customer}
                    className="rounded-lg border border-border p-3"
                    style={{ backgroundColor: "#d4a76a10" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{alert.customer}</p>
                      <Badge variant={alert.current === alert.target ? "default" : "secondary"}>
                        {alert.current}/{alert.target}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                    <LoyaltyDots current={alert.current} target={alert.target} />
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
