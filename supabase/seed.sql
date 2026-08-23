-- ============================================
-- CafeSync Seed Data
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================

-- 1. Create the demo cafe
insert into public.cafes (id, name, slug, description, email, phone, address)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Cafe Sunshine',
  'cafe-sunshine',
  'A cozy neighborhood cafe serving handcrafted beverages and fresh snacks.',
  'owner@cafesunshine.com',
  '+91 98765 43210',
  'MG Road, Bangalore'
);

-- 2. Create categories
insert into public.categories (id, cafe_id, name, sort_order) values
  ('11111111-1111-1111-1111-111111111001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hot Coffee', 1),
  ('11111111-1111-1111-1111-111111111002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Cold Coffee', 2),
  ('11111111-1111-1111-1111-111111111003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tea', 3),
  ('11111111-1111-1111-1111-111111111004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pastries', 4),
  ('11111111-1111-1111-1111-111111111005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Snacks', 5);

-- 3. Create products
insert into public.products (cafe_id, category_id, name, description, price, emoji, is_available) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111001', 'Cappuccino', 'Classic Italian coffee with steamed milk', 150.00, '☕', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111001', 'Latte', 'Smooth espresso with creamy milk', 160.00, '☕', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111001', 'Espresso', 'Strong and bold single shot', 100.00, '⚡', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111002', 'Cold Brew', 'Slow-steeped for 12 hours', 180.00, '🧊', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111002', 'Iced Mocha', 'Chocolate meets coffee over ice', 200.00, '🍫', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111003', 'Masala Chai', 'Traditional Indian spiced tea', 80.00, '🍵', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111004', 'Croissant', 'Buttery, flaky French pastry', 120.00, '🥐', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111004', 'Blueberry Muffin', 'Fresh blueberry with crumble top', 100.00, '🫐', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111005', 'Chicken Sandwich', 'Grilled chicken with fresh veggies', 180.00, '🥪', false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '11111111-1111-1111-1111-111111111005', 'Paneer Wrap', 'Spiced paneer in a whole wheat wrap', 160.00, '🌯', true);

-- 4. Create loyalty program
insert into public.loyalty_programs (cafe_id, name, type, target_count, reward_description, is_active)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Coffee Rewards',
  'purchase_count',
  6,
  'Free coffee of your choice',
  true
);

-- 5. Create some demo promotions
insert into public.promotions (cafe_id, title, description, discount_percent, target_segment, start_date, end_date, is_active, total_targeted, total_redeemed) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Welcome Back Offer', '15% off your next order', 15, 'inactive', now(), now() + interval '5 days', true, 12, 4),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Weekend Special', 'Buy 2 get 1 free on pastries', null, 'all', now(), now() + interval '2 days', true, 45, 18),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Loyalty Milestone', 'Free upgrade to large', null, 'loyal', now() - interval '10 days', now() - interval '3 days', false, 34, 23);
