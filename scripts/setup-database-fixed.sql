-- Create tables (only if they don't exist)
CREATE TABLE IF NOT EXISTS fields (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    location text,
    description text,
    photo_url text,
    sport_type text DEFAULT 'Baseball',
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    grass_rating integer CHECK (grass_rating >= 1 AND grass_rating <= 5),
    dirt_rating integer CHECK (dirt_rating >= 1 AND dirt_rating <= 5),
    dugout_rating integer CHECK (dugout_rating >= 1 AND dugout_rating <= 5),
    fence_rating integer CHECK (fence_rating >= 1 AND fence_rating <= 5),
    bleacher_rating integer CHECK (bleacher_rating >= 1 AND bleacher_rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
    donor_name text NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS field_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    image_url text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (safe to run multiple times)
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Fields are viewable by everyone" ON fields;
DROP POLICY IF EXISTS "Authenticated users can insert fields" ON fields;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Donations are viewable by everyone" ON donations;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;
DROP POLICY IF EXISTS "Field photos are viewable by everyone" ON field_photos;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON field_photos;

-- Create policies
CREATE POLICY "Fields are viewable by everyone" ON fields FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert fields" ON fields FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Donations are viewable by everyone" ON donations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert donations" ON donations FOR INSERT WITH CHECK (true);

CREATE POLICY "Field photos are viewable by everyone" ON field_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload photos" ON field_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('field-photos', 'field-photos', true)
ON CONFLICT (id) DO NOTHING;