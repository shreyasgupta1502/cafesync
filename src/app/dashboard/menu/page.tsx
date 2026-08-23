import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("sort_order");

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("name");

  const categoryNames = ["All", ...(categories?.map((c) => c.name) ?? [])];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">
            {products?.length ?? 0} products across {categories?.length ?? 0} categories
          </p>
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
          {categoryNames.map((cat, i) => (
            <span
              key={cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product) => (
          <Card
            key={product.id}
            className={`group transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
              !product.is_available ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-5">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary transition-transform group-hover:scale-105">
                <span className="text-4xl">{product.emoji}</span>
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-primary">₹{product.price}</p>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <Badge variant="secondary" className="text-[11px]">
                    {product.categories?.name ?? "Other"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        product.is_available ? "bg-success" : "bg-destructive"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-medium ${
                        product.is_available ? "text-success" : "text-destructive"
                      }`}
                    >
                      {product.is_available ? "Available" : "Unavailable"}
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
