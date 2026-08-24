-- ============================================
-- CafeSync Demo Customer & Order Seed Data
-- Simplified version: removes foreign key constraint temporarily
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Temporarily drop the foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Seed the data
DO $$
DECLARE
  v_cafe_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_loyalty_program_id uuid;
  customer_names text[] := ARRAY[
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh',
    'Meera Joshi', 'Arjun Nair', 'Ananya Iyer', 'Rohan Mehta', 'Kavya Desai',
    'Sanjay Gupta', 'Divya Rao', 'Karthik Menon', 'Pooja Verma', 'Aditya Shah',
    'Riya Kapoor', 'Nikhil Bhat', 'Shruti Pillai', 'Varun Jain', 'Isha Agarwal',
    'Manoj Nair', 'Neha Sinha', 'Rajesh Kumar', 'Anjali Murthy', 'Suresh Reddy',
    'Lakshmi Iyer', 'Harish Patel', 'Deepa Sharma', 'Vishal Rao', 'Gayatri Singh',
    'Prakash Menon', 'Swati Gupta', 'Naveen Kumar', 'Rekha Desai', 'Ashok Verma',
    'Madhuri Shah', 'Ramesh Joshi', 'Sunita Kapoor', 'Mukesh Bhat', 'Leela Pillai',
    'Dinesh Jain', 'Kamala Agarwal', 'Bala Nair', 'Radha Sinha', 'Girish Kumar',
    'Parvati Murthy', 'Mohan Reddy', 'Sarita Iyer', 'Vijay Patel', 'Uma Sharma'
  ];
  v_customer_id uuid;
  v_product_ids uuid[];
  v_product_prices numeric[];
  v_product_names text[];
  v_order_id uuid;
  v_order_date timestamptz;
  v_items_in_order int;
  v_product_idx int;
  v_customer_order_count int;
  v_order_total numeric;
  v_total_orders int;
  v_loyalty_count int;
  v_rewards_earned int;
  i int;
  j int;
  k int;
BEGIN
  SELECT id INTO v_loyalty_program_id FROM loyalty_programs WHERE cafe_id = v_cafe_id LIMIT 1;

  SELECT array_agg(id), array_agg(price), array_agg(name)
  INTO v_product_ids, v_product_prices, v_product_names
  FROM products WHERE cafe_id = v_cafe_id;

  FOR i IN 1..50 LOOP
    v_customer_id := gen_random_uuid();
    
    INSERT INTO profiles (id, cafe_id, full_name, email, role, created_at)
    VALUES (
      v_customer_id,
      v_cafe_id,
      customer_names[i],
      lower(replace(customer_names[i], ' ', '')) || '@email.com',
      'customer',
      NOW() - (random() * interval '60 days')
    );

    IF i <= 10 THEN
      v_customer_order_count := 30 + floor(random() * 20)::int;
    ELSIF i <= 35 THEN
      v_customer_order_count := 10 + floor(random() * 15)::int;
    ELSE
      v_customer_order_count := 2 + floor(random() * 6)::int;
    END IF;

    FOR j IN 1..v_customer_order_count LOOP
      v_order_id := gen_random_uuid();
      v_order_date := NOW() - (power(random(), 2) * interval '30 days');
      
      v_items_in_order := CASE
        WHEN random() < 0.6 THEN 1
        WHEN random() < 0.9 THEN 2
        ELSE 2 + floor(random() * 2)::int
      END;

      INSERT INTO orders (id, cafe_id, customer_id, total_amount, status, created_at)
      VALUES (
        v_order_id,
        v_cafe_id,
        v_customer_id,
        0,
        'completed',
        v_order_date
      );

      v_order_total := 0;
      FOR k IN 1..v_items_in_order LOOP
        v_product_idx := 1 + floor(random() * array_length(v_product_ids, 1))::int;
        
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
        VALUES (
          v_order_id,
          v_product_ids[v_product_idx],
          v_product_names[v_product_idx],
          1,
          v_product_prices[v_product_idx],
          v_product_prices[v_product_idx]
        );

        v_order_total := v_order_total + v_product_prices[v_product_idx];
      END LOOP;

      UPDATE orders SET total_amount = v_order_total WHERE id = v_order_id;
    END LOOP;

    SELECT COUNT(*) INTO v_total_orders FROM orders WHERE customer_id = v_customer_id;
    v_loyalty_count := v_total_orders % 6;
    v_rewards_earned := v_total_orders / 6;

    INSERT INTO loyalty_progress (program_id, customer_id, current_count, is_reward_ready, rewards_earned)
    VALUES (
      v_loyalty_program_id,
      v_customer_id,
      v_loyalty_count,
      v_loyalty_count >= 6,
      v_rewards_earned
    );
  END LOOP;

  RAISE NOTICE 'Created 50 customers with % total orders', (SELECT COUNT(*) FROM orders);
END $$;

-- Step 3: Add back a modified foreign key constraint (without cascade delete)
-- This allows demo profiles to exist without auth.users entries
-- Real signups will still create both auth.users and profiles
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) 
  ON DELETE CASCADE 
  NOT VALID;
