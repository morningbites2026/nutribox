-- SQL Script to Set Up Supabase Database for Nutribox
-- Copy and paste this into the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Drop existing tables if they exist (clean start)
DROP TABLE IF EXISTS salad_plans;
DROP TABLE IF EXISTS site_settings;

-- 2. Create site_settings table
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Create salad_plans table
CREATE TABLE salad_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price_weekly NUMERIC NOT NULL,
    price_monthly NUMERIC NOT NULL,
    price_pack NUMERIC NOT NULL DEFAULT 0,
    pack_name TEXT DEFAULT '10 Pack',
    ingredients TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Insert Default Site Settings
INSERT INTO site_settings (key, value) VALUES
('business_name', 'Nutribox'),
('logo_url', ''),
('hero_title', 'Fresh, Chef-Crafted Salad Plans Delivered to Your Doorstep'),
('hero_subtitle', 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.'),
('contact_email', 'hello@nutribox.com'),
('contact_phone', '+91 98765 43210'),
('contact_address', '123 Green Avenue, Sector 5, HSR Layout, Bangalore, Karnataka 560102'),
('business_hours', 'Mon - Sat: 8:00 AM - 6:00 PM'),
('admin_passcode', 'admin123')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 5. Insert Default Salad Plans
INSERT INTO salad_plans (title, description, price_weekly, price_monthly, price_pack, pack_name, ingredients, tags, image_url) VALUES
(
  'Lean & Green', 
  'Designed for weight loss and detoxification. High in fiber, low in carbs, and packed with fresh leafy greens.', 
  699, 
  2499, 
  400,
  '10 Pack',
  ARRAY['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Avocado', 'Pumpkin Seeds', 'Lemon Vinaigrette'], 
  ARRAY['Low Carb', 'Weight Loss', 'Vegan'], 
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
),
(
  'Protein Powerhouse', 
  'Rich in clean proteins to support muscle growth and recovery. Balanced with wholesome grains and nuts.', 
  899, 
  3199, 
  500,
  '10 Pack',
  ARRAY['Grilled Chicken Breast', 'Quinoa', 'Mixed Greens', 'Broccoli Florets', 'Feta Cheese', 'Almonds', 'Tahini Dressing'], 
  ARRAY['High Protein', 'Gluten Free', 'Active Lifestyle'], 
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
),
(
  'Keto Balance', 
  'High healthy fats, moderate protein, and ultra-low carbs. Kept delicious with premium cheeses and dressings.', 
  849, 
  2999, 
  450,
  '10 Pack',
  ARRAY['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'], 
  ARRAY['Keto', 'High Fat', 'Gluten Free'], 
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
);

-- 6. Row-Level Security (RLS) Configuration
-- Enable RLS for security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE salad_plans ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow ANYONE to read settings and plans
CREATE POLICY "Allow public read on site_settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow public read on salad_plans" ON salad_plans
    FOR SELECT USING (true);

-- For simple passcode-based authentication from a static client, we allow authenticated
-- users or custom rules. For development simplicity, we will allow all operations.
-- WARNING: In production, you should lock this down using Supabase Auth or service role.
CREATE POLICY "Allow public write on site_settings" ON site_settings
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public write on salad_plans" ON salad_plans
    FOR ALL USING (true) WITH CHECK (true);
