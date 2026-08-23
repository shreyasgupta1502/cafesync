// Database types for CafeSync
// These match the Supabase tables we created

export type Cafe = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  settings: Record<string, unknown>;
  created_at: string;
};

export type Profile = {
  id: string;
  cafe_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "owner" | "customer";
  created_at: string;
};

export type Category = {
  id: string;
  cafe_id: string;
  name: string;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  cafe_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  emoji: string;
  is_available: boolean;
  created_at: string;
  // Joined data
  categories?: Category;
};

export type Order = {
  id: string;
  cafe_id: string;
  customer_id: string | null;
  order_number: number;
  total_amount: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  created_at: string;
  // Joined data
  profiles?: Profile;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type LoyaltyProgram = {
  id: string;
  cafe_id: string;
  name: string;
  type: "purchase_count" | "spend_amount";
  target_count: number;
  reward_description: string;
  is_active: boolean;
  created_at: string;
};

export type LoyaltyProgress = {
  id: string;
  program_id: string;
  customer_id: string;
  current_count: number;
  is_reward_ready: boolean;
  rewards_earned: number;
  updated_at: string;
};

export type Promotion = {
  id: string;
  cafe_id: string;
  title: string;
  description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  target_segment: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  total_targeted: number;
  total_redeemed: number;
  created_at: string;
};

export type AgentCampaign = {
  id: string;
  cafe_id: string;
  agent_type: string;
  analysis: string | null;
  recommendations: Record<string, unknown> | null;
  status: "pending_review" | "approved" | "rejected" | "executed";
  owner_response: string | null;
  executed_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  cafe_id: string;
  customer_id: string;
  type: "order" | "loyalty" | "reward" | "promotion" | "general";
  title: string;
  message: string;
  channel: "in_app" | "email" | "whatsapp";
  is_read: boolean;
  sent_at: string;
  read_at: string | null;
};

// The demo cafe ID (used throughout the app until multi-tenant)
export const DEMO_CAFE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
