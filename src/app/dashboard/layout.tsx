import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile to check role and show user info
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, cafes(name, address)")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "owner") {
    redirect("/menu");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userName={profile.full_name}
        cafeName={profile.cafes?.name ?? "My Cafe"}
        cafeAddress={profile.cafes?.address ?? ""}
      />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
