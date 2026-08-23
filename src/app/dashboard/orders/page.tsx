import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  Coffee,
} from "lucide-react";

const orderStats = [
  {
    title: "Today's Orders",
    value: "47",
    icon: ShoppingCart,
  },
  {
    title: "Today's Revenue",
    value: "₹12,450",
    icon: IndianRupee,
  },
  {
    title: "Average Order Value",
    value: "₹265",
    icon: TrendingUp,
  },
];

const orders = [
  {
    id: "ORD-1047",
    customer: "Rahul Sharma",
    items: "Cappuccino x2 + Croissant",
    amount: "₹420",
    time: "2 min ago",
    status: "Completed" as const,
  },
  {
    id: "ORD-1046",
    customer: "Priya Patel",
    items: "Latte + Blueberry Muffin",
    amount: "₹260",
    time: "18 min ago",
    status: "Completed" as const,
  },
  {
    id: "ORD-1045",
    customer: "Guest Customer",
    items: "Espresso",
    amount: "₹100",
    time: "35 min ago",
    status: "Completed" as const,
  },
  {
    id: "ORD-1044",
    customer: "Sneha Reddy",
    items: "Iced Mocha + Chicken Sandwich",
    amount: "₹380",
    time: "1 hour ago",
    status: "Completed" as const,
  },
  {
    id: "ORD-1043",
    customer: "Vikram Singh",
    items: "Cold Brew x2",
    amount: "₹360",
    time: "2 hours ago",
    status: "Completed" as const,
  },
  {
    id: "ORD-1042",
    customer: "Meera Joshi",
    items: "Masala Chai x3 + Paneer Wrap",
    amount: "₹400",
    time: "3 hours ago",
    status: "Completed" as const,
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage all customer orders in real time.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {orderStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            All orders placed today, newest first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Order info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Coffee className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.customer}</p>
                      <span className="text-xs font-mono text-muted-foreground">
                        {order.id}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items}
                    </p>
                  </div>
                </div>

                {/* Right: Amount, time, status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {order.time}
                  </div>
                  <span className="text-sm font-bold">{order.amount}</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border">
                    <CheckCircle2 className="h-3 w-3" />
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
