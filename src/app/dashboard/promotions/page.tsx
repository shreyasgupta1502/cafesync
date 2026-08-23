import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, Gift } from "lucide-react";

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional campaigns</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      <div className="space-y-4">
        {promotions?.map((promo) => {
          const isActive = promo.is_active;
          const redemptionRate =
            promo.total_targeted > 0
              ? (promo.total_redeemed / promo.total_targeted) * 100
              : 0;

          const endDate = promo.end_date ? new Date(promo.end_date) : null;
          const now = new Date();
          const daysLeft = endDate
            ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
            : null;

          return (
            <Card
              key={promo.id}
              className={`transition-all hover:shadow-md ${!isActive ? "opacity-75" : ""}`}
              style={
                isActive
                  ? { borderLeft: "4px solid #16a34a" }
                  : { borderLeft: "4px solid #e2d5c3" }
              }
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{promo.title}</h3>
                    <p className="text-muted-foreground">{promo.description}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                      isActive
                        ? "border-[#16a34a]/20 bg-[#16a34a]/10 text-[#16a34a]"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive ? "Active" : "Ended"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{promo.target_segment ?? "All"} customers</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {isActive && daysLeft !== null
                        ? `Expires in ${daysLeft} days`
                        : !isActive
                        ? "Ended"
                        : "No expiry"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Gift className="h-3.5 w-3.5" />
                    <span>
                      {promo.total_redeemed} redeemed of {promo.total_targeted} targeted
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Redemption Rate</span>
                    <span>{Math.round(redemptionRate)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${redemptionRate}%`,
                        backgroundColor: isActive ? "#16a34a" : "#8b7355",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
