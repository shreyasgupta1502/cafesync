import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, Gift } from "lucide-react";

const promotions = [
  {
    title: "Welcome Back Offer",
    description: "15% off your next order",
    target: "Inactive customers",
    status: "Active",
    expiry: "Expires in 5 days",
    targeted: 12,
    redeemed: 4,
  },
  {
    title: "Weekend Special",
    description: "Buy 2 get 1 free on pastries",
    target: "All customers",
    status: "Active",
    expiry: "Expires in 2 days",
    targeted: 45,
    redeemed: 18,
  },
  {
    title: "Loyalty Milestone",
    description: "Free upgrade to large",
    target: "Customers with 4+ loyalty points",
    status: "Ended",
    expiry: "Ran for 7 days",
    targeted: 34,
    redeemed: 23,
  },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map((promo) => {
          const isActive = promo.status === "Active";
          const redemptionRate = promo.targeted > 0 ? (promo.redeemed / promo.targeted) * 100 : 0;

          return (
            <Card
              key={promo.title}
              className={`transition-all hover:shadow-md ${!isActive ? "opacity-75" : ""}`}
              style={isActive ? { borderLeft: "4px solid #16a34a" } : { borderLeft: "4px solid #e2d5c3" }}
            >
              <CardContent className="p-6">
                {/* Top Row */}
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
                    {promo.status}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{promo.target}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{promo.expiry}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Gift className="h-3.5 w-3.5" />
                    <span>{promo.redeemed} redeemed of {promo.targeted} targeted</span>
                  </div>
                </div>

                {/* Progress Bar */}
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
