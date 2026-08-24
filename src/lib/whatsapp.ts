import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendWhatsAppNotification(
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Format phone number for WhatsApp (must include country code)
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    const formattedFrom = `whatsapp:${whatsappNumber}`;

    const messageResponse = await client.messages.create({
      body: message,
      from: formattedFrom,
      to: formattedTo,
    });

    console.log("WhatsApp sent:", messageResponse.sid);
    return { success: true };
  } catch (error: any) {
    console.error("WhatsApp Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Template messages for different notifications
export const templates = {
  orderConfirmation: (customerName: string, orderTotal: number, items: string) => 
    `🎉 Order Confirmed!\n\nHi ${customerName}! Your order has been placed.\n\n📦 Items: ${items}\n💰 Total: ₹${orderTotal}\n\nThank you for choosing Cafe Sunshine! ☕`,
  
  loyaltyUpdate: (customerName: string, current: number, target: number) =>
    `⭐ Loyalty Update!\n\nHi ${customerName}! You're making progress.\n\n☕ ${current}/${target} coffees towards your free reward!\n\nKeep going! 🎁`,
  
  rewardEarned: (customerName: string) =>
    `🎉 FREE REWARD EARNED!\n\nCongratulations ${customerName}! 🎊\n\nYou've earned a FREE coffee! Claim it at Cafe Sunshine.\n\nShow this message to redeem. ☕✨`,
  
  promotionAlert: (customerName: string, promoTitle: string, promoDesc: string) =>
    `🔥 Special Offer for You!\n\nHi ${customerName}!\n\n${promoTitle}\n${promoDesc}\n\nVisit Cafe Sunshine to redeem! ☕`,
};
