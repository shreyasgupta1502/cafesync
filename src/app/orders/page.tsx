import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomerNav } from "@/components/customer-nav";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's orders with items
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      status,
      created_at,
      order_items(product_name, quantity, unit_price)
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  // Get loyalty progress to show points earned
  const { data: loyaltyProgress } = await supabase
    .from("loyalty_progress")
    .select("loyalty_programs!inner(target_count)")
    .eq("customer_id", user.id)
    .single();

  const targetCount = (loyaltyProgress?.loyalty_programs as any)?.target_count ?? 6;

  function getRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-IN", { 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
  }

  function getTimeString(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Your order history at Cafe Sunshine
          </p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = (order.order_items as any[]) ?? [];
              const loyaltyPoints = Math.min(items.reduce((sum, item) => sum + item.quantity, 0), 1);

              return (
                <Card key={order.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-5">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <code className="text-sm font-mono font-semibold">
                            #{order.order_number ?? order.id.slice(0, 8).toUpperCase()}
                          </code>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeDate(order.created_at)} at {getTimeString(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-[#16a34a]/20 bg-[#16a34a]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">☕</span>
                            <span>{item.product_name}</span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                            )}
                          </div>
                          <span className="text-muted-foreground">
                            ₹{(Number(item.unit_price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="mb-3" />

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Loyalty earned:</span>
                        <Badge variant="secondary" className="text-[11px]">
                          +{loyaltyPoints} {loyaltyPoints === 1 ? "point" : "points"}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start ordering to earn loyalty rewards!
              </p>
              <a 
                href="/menu"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Menu
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
