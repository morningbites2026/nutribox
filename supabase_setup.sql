-- SQL Script to Set Up Supabase Database for Nutribox
-- Copy and paste this into the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Drop existing tables if they exist (clean start)
DROP TABLE IF EXISTS salad_plans;
DROP TABLE IF EXISTS salads;
DROP TABLE IF EXISTS site_settings;

-- 2. Create site_settings table
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Create salads table (Individual salads)
CREATE TABLE salads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    ingredients TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create salad_plans table (Subscription plans composed of salads)
CREATE TABLE salad_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price_weekly NUMERIC NOT NULL,
    price_monthly NUMERIC NOT NULL,
    price_pack NUMERIC NOT NULL DEFAULT 0,
    pack_name TEXT DEFAULT '10 Pack',
    salad_ids UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Insert Default Site Settings
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

-- 6. Insert Default Salads (Temporary variables to hold IDs)
-- We will use a script block or standard insert and select to populate relation.
-- To keep the SQL editor copy-paste simple, we insert salads first:
INSERT INTO salads (id, title, description, price, ingredients, tags, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Garden Greens Salad', 'Fresh leafy greens, cucumber, tomatoes, and organic seeds.', 150, ARRAY['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Pumpkin Seeds', 'Lemon Vinaigrette'], ARRAY['Low Carb', 'Vegan', 'Organic'], 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Protein Booster Salad', 'Grilled chicken breast with almonds, greens, and broccoli.', 220, ARRAY['Grilled Chicken Breast', 'Mixed Greens', 'Broccoli Florets', 'Almonds', 'Tahini Dressing'], ARRAY['High Protein', 'Gluten Free'], 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Keto Smoked Salmon', 'High healthy fats from smoked salmon, hard boiled egg, and walnuts.', 250, ARRAY['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'], ARRAY['Keto', 'High Fat', 'Gluten Free'], 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Feta Berry Crunch', 'Vegetarian delight with crumbled feta, fresh berries, and walnuts.', 180, ARRAY['Feta Cheese', 'Strawberries', 'Spinach', 'Walnuts', 'Balsamic Vinaigrette'], ARRAY['Vegetarian', 'Gluten Free'], 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600');

-- 7. Insert Default Salad Plans linked to Salads
INSERT INTO salad_plans (title, description, price_weekly, price_monthly, price_pack, pack_name, salad_ids) VALUES
(
  'Lean & Green Plan', 
  'Designed for weight loss and detoxification. Combines our Garden Greens and Feta Berry salads.', 
  699, 
  2499, 
  400,
  '10 Pack',
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID]
),
(
  'Protein Powerhouse Plan', 
  'Support muscle recovery with high protein chicken and salmon options.', 
  899, 
  3199, 
  500,
  '10 Pack',
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID]
),
(
  'Keto Balance Plan', 
  'Ultra-low carb plan syncing our healthy Keto Smoked Salmon and Garden Greens salads.', 
  849, 
  2999, 
  450,
  '10 Pack',
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID]
);

-- 8. Row-Level Security (RLS) Configuration
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE salads ENABLE ROW LEVEL SECURITY;
ALTER TABLE salad_plans ENABLE ROW LEVEL SECURITY;

-- Read policies
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on salads" ON salads FOR SELECT USING (true);
CREATE POLICY "Allow public read on salad_plans" ON salad_plans FOR SELECT USING (true);

-- Write policies
CREATE POLICY "Allow public write on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on salads" ON salads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on salad_plans" ON salad_plans FOR ALL USING (true) WITH CHECK (true);
