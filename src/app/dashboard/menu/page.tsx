import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = ["All", "Hot Coffee", "Cold Coffee", "Tea", "Pastries", "Snacks"];

const products = [
  { name: "Cappuccino", emoji: "☕", price: 150, category: "Hot Coffee", desc: "Classic Italian coffee with steamed milk", available: true },
  { name: "Latte", emoji: "☕", price: 160, category: "Hot Coffee", desc: "Smooth espresso with creamy milk", available: true },
  { name: "Espresso", emoji: "⚡", price: 100, category: "Hot Coffee", desc: "Strong and bold single shot", available: true },
  { name: "Cold Brew", emoji: "🧊", price: 180, category: "Cold Coffee", desc: "Slow-steeped for 12 hours", available: true },
  { name: "Iced Mocha", emoji: "🍫", price: 200, category: "Cold Coffee", desc: "Chocolate meets coffee over ice", available: true },
  { name: "Masala Chai", emoji: "🍵", price: 80, category: "Tea", desc: "Traditional Indian spiced tea", available: true },
  { name: "Croissant", emoji: "🥐", price: 120, category: "Pastries", desc: "Buttery, flaky French pastry", available: true },
  { name: "Blueberry Muffin", emoji: "🫐", price: 100, category: "Pastries", desc: "Fresh blueberry with crumble top", available: true },
  { name: "Chicken Sandwich", emoji: "🥪", price: 180, category: "Snacks", desc: "Grilled chicken with fresh veggies", available: false },
  { name: "Paneer Wrap", emoji: "🌯", price: 160, category: "Snacks", desc: "Spiced paneer in a whole wheat wrap", available: true },
];

export default function MenuPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">{products.length} products across {categories.length - 1} categories</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search + Category Filters */}
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.name}
            className={`group transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
              !product.available ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-5">
              {/* Emoji Image */}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary transition-transform group-hover:scale-105">
                <span className="text-4xl">{product.emoji}</span>
              </div>

              {/* Info */}
              <div className="text-center space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{product.desc}</p>
                <p className="text-lg font-bold text-primary">₹{product.price}</p>

                {/* Tags Row */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <Badge variant="secondary" className="text-[11px]">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${product.available ? "bg-success" : "bg-destructive"}`} />
                    <span className={`text-[11px] font-medium ${product.available ? "text-success" : "text-destructive"}`}>
                      {product.available ? "Available" : "Unavailable"}
                    </span>
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
