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
import { Plus, Coffee, IceCreamCone, CupSoda, Croissant, UtensilsCrossed } from "lucide-react";

const menuItems = [
  {
    name: "Cappuccino",
    price: 150,
    category: "Hot Coffee",
    description: "Classic Italian coffee with steamed milk",
    available: true,
  },
  {
    name: "Latte",
    price: 160,
    category: "Hot Coffee",
    description: "Smooth espresso with creamy milk",
    available: true,
  },
  {
    name: "Espresso",
    price: 100,
    category: "Hot Coffee",
    description: "Strong and bold single shot",
    available: true,
  },
  {
    name: "Cold Brew",
    price: 180,
    category: "Cold Coffee",
    description: "Slow-steeped for 12 hours",
    available: true,
  },
  {
    name: "Iced Mocha",
    price: 200,
    category: "Cold Coffee",
    description: "Chocolate meets coffee over ice",
    available: false,
  },
  {
    name: "Masala Chai",
    price: 80,
    category: "Tea",
    description: "Traditional Indian spiced tea",
    available: true,
  },
  {
    name: "Croissant",
    price: 120,
    category: "Pastries",
    description: "Buttery, flaky French pastry",
    available: true,
  },
  {
    name: "Blueberry Muffin",
    price: 100,
    category: "Pastries",
    description: "Fresh blueberry with crumble top",
    available: true,
  },
  {
    name: "Chicken Sandwich",
    price: 180,
    category: "Snacks",
    description: "Grilled chicken with fresh veggies",
    available: true,
  },
  {
    name: "Paneer Wrap",
    price: 160,
    category: "Snacks",
    description: "Spiced paneer in a whole wheat wrap",
    available: false,
  },
];

const categoryIcons: Record<string, React.ElementType> = {
  "Hot Coffee": Coffee,
  "Cold Coffee": IceCreamCone,
  Tea: CupSoda,
  Pastries: Croissant,
  Snacks: UtensilsCrossed,
};

export default function MenuPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your cafe&apos;s products, pricing, and availability.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {menuItems.length} products
        </p>
        <Button>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map((item) => {
          const Icon = categoryIcons[item.category] || Coffee;
          return (
            <Card key={item.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <Badge
                    variant={item.available ? "default" : "destructive"}
                    className={cn(
                      item.available &&
                        "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-400"
                    )}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₹{item.price}</span>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
