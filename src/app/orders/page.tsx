import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomerNav } from "@/components/customer-nav";
import { Package } from "lucide-react";

const orders = [
  {
    id: "ORD-1047",
    date: "Today, 11:30 AM",
    items: [
      { name: "Cappuccino", qty: 2, price: 150, emoji: "☕" },
      { name: "Croissant", qty: 1, price: 120, emoji: "🥐" },
    ],
    total: 420,
    status: "Completed",
    loyaltyEarned: 3,
  },
  {
    id: "ORD-1038",
    date: "Yesterday, 3:45 PM",
    items: [
      { name: "Cold Brew", qty: 1, price: 180, emoji: "🧊" },
    ],
    total: 180,
    status: "Completed",
    loyaltyEarned: 1,
  },
  {
    id: "ORD-1025",
    date: "Aug 20, 10:15 AM",
    items: [
      { name: "Latte", qty: 1, price: 160, emoji: "☕" },
      { name: "Blueberry Muffin", qty: 1, price: 100, emoji: "🫐" },
      { name: "Paneer Wrap", qty: 1, price: 160, emoji: "🌯" },
    ],
    total: 420,
    status: "Completed",
    loyaltyEarned: 3,
  },
  {
    id: "ORD-1012",
    date: "Aug 17, 9:00 AM",
    items: [
      { name: "Espresso", qty: 2, price: 100, emoji: "⚡" },
      { name: "Masala Chai", qty: 1, price: 80, emoji: "🍵" },
    ],
    total: 280,
    status: "Completed",
    loyaltyEarned: 3,
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <CustomerNav />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">Your order history at Cafe Sunshine</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="transition-all hover:shadow-md">
              <CardContent className="p-5">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <code className="text-sm font-mono font-semibold">{order.id}</code>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <span>{item.name}</span>
                        {item.qty > 1 && (
                          <span className="text-xs text-muted-foreground">x{item.qty}</span>
                        )}
                      </div>
                      <span className="text-muted-foreground">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <Separator className="mb-3" />

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Loyalty earned:</span>
                    <Badge variant="secondary" className="text-[11px]">
                      +{order.loyaltyEarned} {order.loyaltyEarned === 1 ? "point" : "points"}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">₹{order.total}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
