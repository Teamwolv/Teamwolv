-- Add missing pieces to existing Team Wolv database
-- This script only adds what's missing without conflicting with existing objects

-- 1. Add aftermovies table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS aftermovies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event TEXT,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add aftermovies storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) VALUES ('aftermovies', 'aftermovies', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Add gallery storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS on aftermovies table
ALTER TABLE aftermovies ENABLE ROW LEVEL SECURITY;

-- 5. Add aftermovies policies
CREATE POLICY "Public read access to aftermovies" ON aftermovies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create aftermovies" ON aftermovies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update aftermovies" ON aftermovies FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Users can delete aftermovies" ON aftermovies FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 6. Add storage policies for aftermovies and gallery
CREATE POLICY "Public Access aftermovies" ON storage.objects FOR SELECT USING (bucket_id = 'aftermovies');
CREATE POLICY "Public Access gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated users can upload aftermovies" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'aftermovies' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- 7. Add updated_at trigger for aftermovies
CREATE TRIGGER update_aftermovies_updated_at 
    BEFORE UPDATE ON aftermovies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Add booking_url column to events table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'booking_url') THEN
        ALTER TABLE events ADD COLUMN booking_url TEXT;
    END IF;
END $$;

-- 9. Update site_settings table to match the app requirements
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'contact_email') THEN
        ALTER TABLE site_settings ADD COLUMN contact_email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'contact_phone') THEN
        ALTER TABLE site_settings ADD COLUMN contact_phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'contact_location') THEN
        ALTER TABLE site_settings ADD COLUMN contact_location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'social_facebook') THEN
        ALTER TABLE site_settings ADD COLUMN social_facebook TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'social_twitter') THEN
        ALTER TABLE site_settings ADD COLUMN social_twitter TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'social_instagram') THEN
        ALTER TABLE site_settings ADD COLUMN social_instagram TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'site_settings' AND column_name = 'social_linkedin') THEN
        ALTER TABLE site_settings ADD COLUMN social_linkedin TEXT;
    END IF;
END $$;

-- 10. Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error creating user profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Insert sample aftermovies data (only if table is empty)
INSERT INTO aftermovies (title, description, event, video_url) 
SELECT 'Sample Aftermovie 1', 'A sample aftermovie for testing', 'Team Wolv Launch Party', 'https://example.com/video1.mp4'
WHERE NOT EXISTS (SELECT 1 FROM aftermovies WHERE title = 'Sample Aftermovie 1');

-- 12. Success message
DO $$ BEGIN
    RAISE NOTICE 'Successfully added missing components to Team Wolv database!';
    RAISE NOTICE 'Added: aftermovies table, storage buckets, policies, and updated functions';
    RAISE NOTICE 'Your database is now ready for the full Team Wolv application!';
END $$;


