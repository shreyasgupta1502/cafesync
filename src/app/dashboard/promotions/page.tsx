import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  Percent,
  Gift,
  Tag,
  Users,
  Eye,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

const promotions = [
  {
    name: "Welcome Back Offer",
    description: "15% off next order",
    target: "Inactive customers",
    status: "Active" as const,
    expiry: "Expires in 5 days",
    stats: { targeted: 12, redeemed: 4 },
    icon: Percent,
  },
  {
    name: "Weekend Special",
    description: "Buy 2 get 1 free on pastries",
    target: "All customers",
    status: "Active" as const,
    expiry: "Expires in 2 days",
    stats: { views: 45, redeemed: 18 },
    icon: Gift,
  },
  {
    name: "Loyalty Milestone",
    description: "Free upgrade to large",
    target: "Customers with 4+ loyalty points",
    status: "Ended" as const,
    expiry: "Ran for 7 days",
    stats: { redeemed: 23 },
    icon: Tag,
  },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage targeted promotions to boost engagement and sales.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button>
          <Plus className="h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Promotions Grid */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promo) => (
          <Card key={promo.name}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <promo.icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <Badge
                  variant={promo.status === "Active" ? "default" : "secondary"}
                  className={cn(
                    promo.status === "Active" &&
                      "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 border"
                  )}
                >
                  {promo.status}
                </Badge>
              </div>
              <CardTitle className="mt-2">{promo.name}</CardTitle>
              <CardDescription>{promo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Target */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">{promo.target}</span>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{promo.expiry}</span>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4 rounded-lg border border-border p-3 text-sm">
                  {"targeted" in promo.stats && (
                    <div>
                      <span className="font-bold">{promo.stats.targeted}</span>
                      <span className="text-muted-foreground"> targeted</span>
                    </div>
                  )}
                  {"views" in promo.stats && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-bold">{promo.stats.views}</span>
                      <span className="text-muted-foreground">views</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-bold">{promo.stats.redeemed}</span>
                    <span className="text-muted-foreground">redeemed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
