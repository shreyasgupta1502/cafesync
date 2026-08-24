import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppNotification, templates } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const { customerId } = await request.json();
    const supabase = await createClient();

    // Get customer's loyalty progress and profile
    const { data: progress } = await supabase
      .from("loyalty_progress")
      .select("*, loyalty_programs!inner(target_count, cafe_id)")
      .eq("customer_id", customerId)
      .single();

    if (!progress) {
      return NextResponse.json({ error: "Loyalty progress not found" }, { status: 404 });
    }

    const targetCount = (progress.loyalty_programs as any).target_count;
    
    // Check if customer has enough points
    if (progress.current_count < targetCount) {
      return NextResponse.json(
        { error: "Not enough loyalty points" },
        { status: 400 }
      );
    }

    const cafeId = (progress.loyalty_programs as any).cafe_id;

    // Get customer profile for WhatsApp
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", customerId)
      .single();

    // Reset loyalty counter and increment rewards earned
    const { error: updateError } = await supabase
      .from("loyalty_progress")
      .update({
        current_count: 0,
        is_reward_ready: false,
        rewards_earned: progress.rewards_earned + 1,
      })
      .eq("customer_id", customerId);

    if (updateError) {
      throw new Error("Failed to update loyalty progress");
    }

    // Create notification for successful redemption
    await supabase.from("notifications").insert({
      cafe_id: cafeId,
      customer_id: customerId,
      type: "reward",
      title: "Reward Redeemed!",
      message: "Your free coffee reward has been redeemed. Show this to the cafe staff.",
      channel: "in_app",
      is_read: false,
    });

    // Send WhatsApp notification
    if (profile?.phone) {
      const message = templates.rewardEarned(profile.full_name);
      await sendWhatsAppNotification(profile.phone, message);
    }

    return NextResponse.json({
      success: true,
      message: "Reward redeemed successfully! Show this to the cafe staff.",
    });
  } catch (error: any) {
    console.error("Redeem Reward Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to redeem reward" },
      { status: 500 }
    );
  }
}
