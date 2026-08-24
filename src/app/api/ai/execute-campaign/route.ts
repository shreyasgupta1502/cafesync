import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEMO_CAFE_ID } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { insight, ownerResponse } = await request.json();
    const supabase = await createClient();

    // 1. Log the campaign in agent_campaigns table
    const { data: campaign, error: campaignError } = await supabase
      .from("agent_campaigns")
      .insert({
        cafe_id: DEMO_CAFE_ID,
        agent_type: "customer_engagement",
        analysis: insight.description,
        recommendations: {
          title: insight.title,
          customers: insight.customers,
          recommendation: insight.recommendation,
          type: insight.type,
          priority: insight.priority,
        },
        status: "approved",
        owner_response: ownerResponse || "Approved and executing",
        executed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignError) {
      throw new Error("Failed to log campaign");
    }

    // 2. Create promotion based on insight
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 day duration

    let discountPercent = null;
    if (insight.recommendation.includes("discount") || insight.recommendation.includes("%")) {
      discountPercent = 15; // Default 15% discount
    }

    const { data: promotion, error: promoError } = await supabase
      .from("promotions")
      .insert({
        cafe_id: DEMO_CAFE_ID,
        title: insight.title,
        description: insight.recommendation,
        discount_percent: discountPercent,
        target_segment: insight.type,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        total_targeted: insight.customers.length,
        total_redeemed: 0,
      })
      .select()
      .single();

    if (promoError) {
      throw new Error("Failed to create promotion");
    }

    // 3. Get customer IDs from names
    const { data: customerProfiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("cafe_id", DEMO_CAFE_ID)
      .in("full_name", insight.customers);

    // 4. Create notifications for targeted customers
    if (customerProfiles && customerProfiles.length > 0) {
      const notifications = customerProfiles.map((customer) => ({
        cafe_id: DEMO_CAFE_ID,
        customer_id: customer.id,
        type: "promotion" as const,
        title: insight.title,
        message: insight.recommendation,
        channel: "in_app" as const,
        is_read: false,
      }));

      await supabase.from("notifications").insert(notifications);
    }

    return NextResponse.json({
      success: true,
      campaign,
      promotion,
      notificationsSent: customerProfiles?.length || 0,
    });
  } catch (error: any) {
    console.error("Execute Campaign Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute campaign" },
      { status: 500 }
    );
  }
}
