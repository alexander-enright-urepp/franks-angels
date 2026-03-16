-- Franks Angels Database Schema
-- Run this in your Supabase SQL Editor

-- Create fields table
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

-- Create reviews table
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

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
    donor_name text NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    created_at timestamp with time zone DEFAULT now()
);

-- Create field_photos table
CREATE TABLE IF NOT EXISTS field_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    field_id uuid REFERENCES fields(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    image_url text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_city ON fields(city);
CREATE INDEX IF NOT EXISTS idx_fields_state ON fields(state);
CREATE INDEX IF NOT EXISTS idx_reviews_field_id ON reviews(field_id);
CREATE INDEX IF NOT EXISTS idx_donations_field_id ON donations(field_id);
CREATE INDEX IF NOT EXISTS idx_field_photos_field_id ON field_photos(field_id);

-- Enable Row Level Security
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_photos ENABLE ROW LEVEL SECURITY;

-- Fields policies
CREATE POLICY "Fields are viewable by everyone" 
    ON fields FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert fields" 
    ON fields FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own fields" 
    ON fields FOR UPDATE 
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own fields" 
    ON fields FOR DELETE 
    USING (auth.uid() = created_by);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" 
    ON reviews FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert reviews" 
    ON reviews FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reviews" 
    ON reviews FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
    ON reviews FOR DELETE 
    USING (auth.uid() = user_id);

-- Donations policies
CREATE POLICY "Donations are viewable by everyone" 
    ON donations FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can insert donations" 
    ON donations FOR INSERT 
    WITH CHECK (true);

-- Field photos policies
CREATE POLICY "Field photos are viewable by everyone" 
    ON field_photos FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can upload photos" 
    ON field_photos FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own photos" 
    ON field_photos FOR DELETE 
    USING (auth.uid() = user_id);

-- Create storage bucket for field photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('field-photos', 'field-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Field photos are viewable by everyone" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'field-photos');

CREATE POLICY "Authenticated users can upload field photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'field-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own field photos" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'field-photos' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own field photos" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'field-photos' AND auth.uid() = owner);