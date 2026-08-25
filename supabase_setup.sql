-- SQL Script to Set Up Supabase Database for Nutribox (Safe Migration Mode)
-- Copy and paste this into the Supabase SQL Editor.
-- NOTE: This script does NOT drop the 'salads' table to preserve your added salads!

-- 1. Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Create salads table if it doesn't exist (PRESERVES existing salads)
CREATE TABLE IF NOT EXISTS salads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    variant_support TEXT DEFAULT 'both',
    price_half NUMERIC DEFAULT 0,
    price_full NUMERIC DEFAULT 0,
    image_url TEXT,
    ingredients TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Run column additions to ensure salads table matches the schema format
ALTER TABLE salads ADD COLUMN IF NOT EXISTS variant_support TEXT DEFAULT 'both';
ALTER TABLE salads ADD COLUMN IF NOT EXISTS price_half NUMERIC DEFAULT 0;
ALTER TABLE salads ADD COLUMN IF NOT EXISTS price_full NUMERIC DEFAULT 0;

-- 4. Recreate salad_plans (Combos & Single plans)
DROP TABLE IF EXISTS salad_plans;
CREATE TABLE salad_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    plan_type TEXT DEFAULT 'combo', -- 'individual' or 'combo'
    price NUMERIC NOT NULL DEFAULT 0,
    meals_count INTEGER NOT NULL DEFAULT 10,
    salad_items TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Insert Default Site Settings if not present
INSERT INTO site_settings (key, value) VALUES
('business_name', 'Nutribox'),
('logo_url', ''),
('hero_title', 'Fresh, Chef-Crafted Salads & Combos Delivered to Your Doorstep'),
('hero_subtitle', 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.'),
('contact_email', 'hello@nutribox.com'),
('contact_phone', '+91 94299 29822, +91 98765 43210'),
('contact_address', '123 Green Avenue, Sector 5, HSR Layout, Bangalore, Karnataka 560102'),
('business_hours', 'Mon - Sat: 8:00 AM - 6:00 PM'),
('admin_passcode', 'admin123'),
('social_whatsapp', '+91 94299 29822'),
('social_instagram', 'https://instagram.com/nutribox'),
('footer_text', '© 2026 Nutribox. Fresh & Healthy Salad Subscriptions.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 6. Insert Default Salad Plans (Relational seeds matching default salads)
-- Note: Using default salad UUID keys for compatibility
INSERT INTO salad_plans (title, description, plan_type, price, meals_count, salad_items, image_url) VALUES
(
  'Lean & Clean Single Plan', 
  'Enjoy a 10-meal pack of our low-carb Garden Greens Salad (Half Pack) to jumpstart your diet.', 
  'individual', 
  400,
  10,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11:half'],
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
),
(
  'Detox & Greens Combo Plan', 
  'A healthy combination of Garden Greens (Half Pack) and Feta Berry Crunch (Full Pack) to stay active.', 
  'combo', 
  600, 
  10,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11:half', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14:full'],
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
),
(
  'Muscle Recovery Combo Plan', 
  'Premium protein-heavy combo featuring Protein Booster (Full Pack) and Keto Smoked Salmon (Full Pack).', 
  'combo', 
  900, 
  10,
  ARRAY['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12:full', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13:full'],
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
);

-- 7. Enable RLS (Safe check)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE salads ENABLE ROW LEVEL SECURITY;
ALTER TABLE salad_plans ENABLE ROW LEVEL SECURITY;

-- 8. Row-Level Security (RLS) Policies (Clean Drop & Recreate)
DROP POLICY IF EXISTS "Allow public read on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public read on salads" ON salads;
DROP POLICY IF EXISTS "Allow public read on salad_plans" ON salad_plans;

DROP POLICY IF EXISTS "Allow public write on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public write on salads" ON salads;
DROP POLICY IF EXISTS "Allow public write on salad_plans" ON salad_plans;

-- Recreate policies
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on salads" ON salads FOR SELECT USING (true);
CREATE POLICY "Allow public read on salad_plans" ON salad_plans FOR SELECT USING (true);

CREATE POLICY "Allow public write on site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on salads" ON salads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on salad_plans" ON salad_plans FOR ALL USING (true) WITH CHECK (true);
