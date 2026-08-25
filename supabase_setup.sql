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
    variant_support TEXT DEFAULT 'both', -- 'half', 'full', 'both'
    price_half NUMERIC DEFAULT 0,
    price_full NUMERIC DEFAULT 0,
    image_url TEXT,
    ingredients TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create salad_plans table (Combos)
CREATE TABLE salad_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price_half NUMERIC NOT NULL DEFAULT 0,
    price_full NUMERIC NOT NULL DEFAULT 0,
    salad_items TEXT[] DEFAULT '{}', -- stores '[salad_id]:[variant]'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Insert Default Site Settings
INSERT INTO site_settings (key, value) VALUES
('business_name', 'Nutribox'),
('logo_url', ''),
('hero_title', 'Fresh, Chef-Crafted Salads & Combos Delivered to Your Doorstep'),
('hero_subtitle', 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.'),
('contact_email', 'hello@nutribox.com'),
('contact_phone', '+91 98765 43210'),
('contact_address', '123 Green Avenue, Sector 5, HSR Layout, Bangalore, Karnataka 560102'),
('business_hours', 'Mon - Sat: 8:00 AM - 6:00 PM'),
('admin_passcode', 'admin123')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Insert Default Salads with Half & Full prices
INSERT INTO salads (id, title, description, variant_support, price_half, price_full, ingredients, tags, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Garden Greens Salad', 'Fresh leafy greens, cucumber, tomatoes, and organic seeds.', 'both', 100, 180, ARRAY['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Pumpkin Seeds', 'Lemon Vinaigrette'], ARRAY['Low Carb', 'Vegan', 'Organic'], 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Protein Booster Salad', 'Grilled chicken breast with almonds, greens, and broccoli.', 'both', 150, 260, ARRAY['Grilled Chicken Breast', 'Mixed Greens', 'Broccoli Florets', 'Almonds', 'Tahini Dressing'], ARRAY['High Protein', 'Gluten Free'], 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Keto Smoked Salmon', 'High healthy fats from smoked salmon, hard boiled egg, and walnuts.', 'both', 170, 290, ARRAY['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'], ARRAY['Keto', 'High Fat', 'Gluten Free'], 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Feta Berry Crunch', 'Vegetarian delight with crumbled feta, fresh berries, and walnuts.', 'both', 120, 200, ARRAY['Feta Cheese', 'Strawberries', 'Spinach', 'Walnuts', 'Balsamic Vinaigrette'], ARRAY['Vegetarian', 'Gluten Free'], 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600');

-- 7. Insert Default Combos (Plans)
INSERT INTO salad_plans (title, description, price_half, price_full, salad_items) VALUES
(
  'Detox & Greens Combo', 
  'Combines our detoxifying Garden Greens (Half Pack) and Feta Berry Crunch (Full Pack).', 
  220, 
  380,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11:half', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14:full']
),
(
  'Muscle Recovery Combo', 
  'Double dose of premium protein: Protein Booster (Full Pack) and Keto Smoked Salmon (Full Pack).', 
  320, 
  550,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12:full', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13:full']
),
(
  'Keto Greens Combo', 
  'Synced low-carb recipes: Keto Smoked Salmon (Half Pack) and Garden Greens (Half Pack).', 
  270, 
  470,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11:half', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13:half']
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
