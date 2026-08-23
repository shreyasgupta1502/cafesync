import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, IndianRupee, TrendingUp } from "lucide-react";

const summaryStats = [
  { label: "Today's Orders", value: "47", icon: ShoppingCart, accent: "#d97706" },
  { label: "Revenue", value: "₹12,450", icon: IndianRupee, accent: "#6f4e37" },
  { label: "Avg Order Value", value: "₹265", icon: TrendingUp, accent: "#16a34a" },
];

const orders = [
  { id: "ORD-1047", customer: "Rahul Sharma", items: "Cappuccino x2 + Croissant", amount: "₹420", time: "2 min ago", status: "Completed" },
  { id: "ORD-1046", customer: "Priya Patel", items: "Latte + Blueberry Muffin", amount: "₹260", time: "18 min ago", status: "Completed" },
  { id: "ORD-1045", customer: "Guest Customer", items: "Espresso", amount: "₹100", time: "35 min ago", status: "Completed" },
  { id: "ORD-1044", customer: "Sneha Reddy", items: "Iced Mocha + Chicken Sandwich", amount: "₹380", time: "1 hour ago", status: "Completed" },
  { id: "ORD-1043", customer: "Vikram Singh", items: "Cold Brew x2", amount: "₹360", time: "2 hours ago", status: "Completed" },
  { id: "ORD-1042", customer: "Meera Joshi", items: "Masala Chai x3 + Paneer Wrap", amount: "₹400", time: "3 hours ago", status: "Completed" },
];

function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function OrdersPage() {
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
          <CardDescription>All orders from today</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {orders.map((order, i) => (
              <div key={order.id}>
                <div className="flex items-center gap-4 py-4 px-2 hover:bg-secondary/30 rounded-lg transition-colors">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initials(order.customer)}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <code className="text-xs font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">
                        {order.id}
                      </code>
                      <span className="text-sm font-semibold">{order.customer}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.items}</p>
                  </div>

                  {/* Amount */}
                  <p className="text-sm font-bold text-primary">{order.amount}</p>

                  {/* Time */}
                  <p className="text-xs text-muted-foreground min-w-[80px] text-right">{order.time}</p>

                  {/* Status */}
                  <span className="shrink-0 rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
                    {order.status}
                  </span>
                </div>
                {i < orders.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
