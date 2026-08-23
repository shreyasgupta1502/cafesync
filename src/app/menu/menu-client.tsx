"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import type { Category, Product } from "@/lib/types";

type CartItem = { id: string; name: string; price: number; emoji: string; qty: number };

export function MenuClient({
  categories,
  products,
}: {
  categories: Category[];
  products: (Product & { categories: { name: string } | null })[];
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const categoryNames = ["All", ...categories.map((c) => c.name)];

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.categories?.name === activeCategory);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const getCartQty = (id: string) => cart.find((i) => i.id === id)?.qty ?? 0;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setShowCart(false);
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Order Success Toast */}
      {orderPlaced && (
        <div className="mb-6 rounded-xl border border-[#16a34a]/30 bg-[#16a34a]/10 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-[#16a34a]">
            Order placed successfully! Your loyalty progress has been updated.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
        <p className="text-muted-foreground mt-1">
          Fresh, handcrafted beverages and snacks made with love
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => {
          const cartQty = getCartQty(product.id);
          return (
            <Card
              key={product.id}
              className={`group transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                !product.is_available ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-5">
                {/* Emoji */}
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-secondary transition-transform group-hover:scale-105">
                  <span className="text-5xl">{product.emoji}</span>
                </div>

                {/* Info */}
                <div className="text-center space-y-1.5">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                  <p className="text-xl font-bold text-primary">₹{product.price}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-[11px]">
                      {product.categories?.name ?? "Other"}
                    </Badge>
                    {!product.is_available && (
                      <span className="text-[11px] font-medium text-destructive">Unavailable</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                {product.is_available && (
                  <div className="mt-4">
                    {cartQty === 0 ? (
                      <Button className="w-full gap-2" onClick={() => addToCart(product)}>
                        <Plus className="h-4 w-4" />
                        Add to Order
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQty(product.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-lg font-bold">{cartQty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => updateQty(product.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && !showCart && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-4 rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-2xl transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">{totalItems} items</span>
            <span className="font-bold">₹{totalPrice}</span>
            <span className="text-sm">View Order →</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="rounded-lg p-1.5 hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold min-w-[50px] text-right">₹{item.price * item.qty}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice}</span>
              </div>
              <Button className="w-full h-12 text-base font-semibold" onClick={handlePlaceOrder}>
                Place Order
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                This order counts toward your loyalty reward!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
