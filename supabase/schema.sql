-- ============================================
-- CafeSync Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. CAFES
create table public.cafes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  email text,
  phone text,
  address text,
  settings jsonb default '{}',
  created_at timestamptz default now() not null
);

-- 2. PROFILES (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  full_name text not null,
  email text,
  phone text,
  role text not null check (role in ('owner', 'customer')),
  created_at timestamptz default now() not null
);

-- 3. CATEGORIES
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now() not null
);

-- 4. PRODUCTS
create table public.products (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  emoji text default '☕',
  is_available boolean default true,
  created_at timestamptz default now() not null
);

-- 5. ORDERS
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  customer_id uuid references public.profiles on delete set null,
  order_number serial,
  total_amount numeric(10,2) not null default 0,
  status text not null default 'completed' check (status in ('pending', 'preparing', 'completed', 'cancelled')),
  created_at timestamptz default now() not null
);

-- 6. ORDER ITEMS
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

-- 7. LOYALTY PROGRAMS
create table public.loyalty_programs (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  name text not null,
  type text not null default 'purchase_count' check (type in ('purchase_count', 'spend_amount')),
  target_count int not null default 6,
  reward_description text not null default 'Free coffee of your choice',
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- 8. LOYALTY PROGRESS (per customer per program)
create table public.loyalty_progress (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.loyalty_programs on delete cascade not null,
  customer_id uuid references public.profiles on delete cascade not null,
  current_count int not null default 0,
  is_reward_ready boolean default false,
  rewards_earned int not null default 0,
  updated_at timestamptz default now() not null,
  unique (program_id, customer_id)
);

-- 9. PROMOTIONS
create table public.promotions (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  title text not null,
  description text,
  discount_percent numeric(5,2),
  discount_amount numeric(10,2),
  target_segment text,
  start_date timestamptz default now(),
  end_date timestamptz,
  is_active boolean default true,
  total_targeted int default 0,
  total_redeemed int default 0,
  created_at timestamptz default now() not null
);

-- 10. AGENT CAMPAIGNS (AI agent output)
create table public.agent_campaigns (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  agent_type text not null default 'customer_engagement',
  analysis text,
  recommendations jsonb,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected', 'executed')),
  owner_response text,
  executed_at timestamptz,
  created_at timestamptz default now() not null
);

-- 11. NOTIFICATIONS
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  cafe_id uuid references public.cafes on delete cascade not null,
  customer_id uuid references public.profiles on delete cascade not null,
  type text not null check (type in ('order', 'loyalty', 'reward', 'promotion', 'general')),
  title text not null,
  message text not null,
  channel text not null default 'in_app' check (channel in ('in_app', 'email', 'whatsapp')),
  is_read boolean default false,
  sent_at timestamptz default now(),
  read_at timestamptz
);

-- ============================================
-- INDEXES for common queries
-- ============================================
create index idx_profiles_cafe on public.profiles (cafe_id);
create index idx_products_cafe on public.products (cafe_id);
create index idx_orders_cafe on public.orders (cafe_id);
create index idx_orders_customer on public.orders (customer_id);
create index idx_order_items_order on public.order_items (order_id);
create index idx_loyalty_progress_customer on public.loyalty_progress (customer_id);
create index idx_notifications_customer on public.notifications (customer_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
alter table public.cafes enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.loyalty_programs enable row level security;
alter table public.loyalty_progress enable row level security;
alter table public.promotions enable row level security;
alter table public.agent_campaigns enable row level security;
alter table public.notifications enable row level security;

-- ============================================
-- RLS POLICIES
-- For now: simple policies based on cafe_id
-- These will be refined as we add auth
-- ============================================

-- Cafes: anyone can read (public menu), owners can update their own
create policy "Cafes are viewable by everyone" on public.cafes for select using (true);
create policy "Owners can update their own cafe" on public.cafes for update using (
  id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Profiles: users can read/update their own profile
create policy "Users can view profiles in their cafe" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid());
create policy "Enable insert for authenticated users" on public.profiles for insert with check (id = auth.uid());

-- Categories: anyone can read, owners can manage
create policy "Categories are viewable by everyone" on public.categories for select using (true);
create policy "Owners can manage categories" on public.categories for all using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Products: anyone can read, owners can manage
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Owners can manage products" on public.products for all using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Orders: customers see own orders, owners see all cafe orders
create policy "Customers can view own orders" on public.orders for select using (
  customer_id = auth.uid() or
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);
create policy "Customers can create orders" on public.orders for insert with check (
  customer_id = auth.uid()
);

-- Order Items: visible if order is visible
create policy "Order items follow order access" on public.order_items for select using (
  order_id in (select id from public.orders where customer_id = auth.uid() or
    cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner'))
);
create policy "Can insert order items" on public.order_items for insert with check (
  order_id in (select id from public.orders where customer_id = auth.uid())
);

-- Loyalty Programs: anyone can read, owners can manage
create policy "Loyalty programs are viewable" on public.loyalty_programs for select using (true);
create policy "Owners can manage loyalty programs" on public.loyalty_programs for all using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Loyalty Progress: customers see own, owners see all
create policy "View own loyalty progress" on public.loyalty_progress for select using (
  customer_id = auth.uid() or
  program_id in (select id from public.loyalty_programs where
    cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner'))
);
create policy "Update own loyalty progress" on public.loyalty_progress for insert with check (customer_id = auth.uid());
create policy "Update loyalty progress" on public.loyalty_progress for update using (customer_id = auth.uid());

-- Promotions: anyone can read active, owners can manage
create policy "Active promotions are viewable" on public.promotions for select using (true);
create policy "Owners can manage promotions" on public.promotions for all using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Agent Campaigns: owners only
create policy "Owners can view agent campaigns" on public.agent_campaigns for select using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);
create policy "Owners can manage agent campaigns" on public.agent_campaigns for all using (
  cafe_id in (select cafe_id from public.profiles where id = auth.uid() and role = 'owner')
);

-- Notifications: customers see own
create policy "View own notifications" on public.notifications for select using (customer_id = auth.uid());
create policy "Update own notifications" on public.notifications for update using (customer_id = auth.uid());
