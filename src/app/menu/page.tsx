import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";
import { CustomerNav } from "@/components/customer-nav";
import { MenuClient } from "./menu-client";

export default async function CustomerMenuPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("sort_order");

  // Fetch products with their category name
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("cafe_id", DEMO_CAFE_ID)
    .order("name");

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav />
      <MenuClient
        categories={categories ?? []}
        products={products ?? []}
      />
    </div>
  );
}
