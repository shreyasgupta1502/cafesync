import { NextResponse } from "next/server";
import { sendWhatsAppNotification, templates } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const { to, type, data } = await request.json();

    let message = "";

    switch (type) {
      case "order_confirmation":
        message = templates.orderConfirmation(
          data.customerName,
          data.orderTotal,
          data.items
        );
        break;
      
      case "loyalty_update":
        message = templates.loyaltyUpdate(
          data.customerName,
          data.current,
          data.target
        );
        break;
      
      case "reward_earned":
        message = templates.rewardEarned(data.customerName);
        break;
      
      case "promotion":
        message = templates.promotionAlert(
          data.customerName,
          data.promoTitle,
          data.promoDesc
        );
        break;
      
      default:
        message = data.message || "Notification from Cafe Sunshine";
    }

    const result = await sendWhatsAppNotification(to, message);

    if (!result.success) {
      throw new Error(result.error || "Failed to send WhatsApp");
    }

    return NextResponse.json({ success: true, message: "WhatsApp sent" });
  } catch (error: any) {
    console.error("Send WhatsApp Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send WhatsApp notification" },
      { status: 500 }
    );
  }
}
