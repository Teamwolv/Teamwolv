-- Team Wolv Database Setup - Safe Version
-- This version checks for existing objects before creating them

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create user_role enum (only if it doesn't exist)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
        RAISE NOTICE 'Created user_role enum type';
    ELSE
        RAISE NOTICE 'user_role enum type already exists, skipping';
    END IF;
END $$;

-- 3. Create profiles table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create events table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    booking_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create aftermovies table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS aftermovies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event TEXT,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create site_settings table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_name TEXT NOT NULL DEFAULT 'Team Wolv',
    site_description TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#000000',
    contact_email TEXT,
    contact_phone TEXT,
    contact_location TEXT,
    social_facebook TEXT,
    social_twitter TEXT,
    social_instagram TEXT,
    social_linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('events', 'events', true),
    ('aftermovies', 'aftermovies', true),
    ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE aftermovies ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 9. Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Only admins can insert events" ON events;
DROP POLICY IF EXISTS "Only admins can update events" ON events;
DROP POLICY IF EXISTS "Only admins can delete events" ON events;

DROP POLICY IF EXISTS "Aftermovies are viewable by everyone" ON aftermovies;
DROP POLICY IF EXISTS "Only admins can insert aftermovies" ON aftermovies;
DROP POLICY IF EXISTS "Only admins can update aftermovies" ON aftermovies;
DROP POLICY IF EXISTS "Only admins can delete aftermovies" ON aftermovies;

DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;

-- 10. Create RLS policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update events" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete events" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Aftermovies policies
CREATE POLICY "Aftermovies are viewable by everyone" ON aftermovies
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert aftermovies" ON aftermovies
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update aftermovies" ON aftermovies
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete aftermovies" ON aftermovies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update site settings" ON site_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 11. Create storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload aftermovies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id IN ('events', 'aftermovies', 'gallery'));

CREATE POLICY "Authenticated users can upload events" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'events' AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can upload aftermovies" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'aftermovies' AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated users can upload gallery" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'gallery' AND auth.role() = 'authenticated'
    );

-- 12. Create functions and triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create triggers (drop existing first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update triggers for all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_aftermovies_updated_at ON aftermovies;
CREATE TRIGGER update_aftermovies_updated_at
    BEFORE UPDATE ON aftermovies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Insert default site settings
INSERT INTO site_settings (id, site_name, site_description) 
VALUES ('main', 'Team Wolv', 'Your premier event management platform')
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_description = EXCLUDED.site_description;

-- 15. Insert sample events (only if table is empty)
INSERT INTO events (title, description, date, location, featured, image_url) 
SELECT 'Team Wolv Launch Party', 'Join us for the official launch of Team Wolv platform', '2024-12-15T18:00:00Z', 'Virtual Event', true, '/placeholder.svg?height=240&width=460&query=event image'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Team Wolv Launch Party');

INSERT INTO events (title, description, date, location, featured, image_url) 
SELECT 'Tech Meetup 2024', 'Connect with fellow developers and tech enthusiasts', '2024-12-20T19:00:00Z', 'Downtown Conference Center', false, '/placeholder.svg?height=240&width=460&query=event image'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tech Meetup 2024');

INSERT INTO events (title, description, date, location, featured, image_url) 
SELECT 'Creative Workshop', 'Unleash your creativity in our hands-on workshop', '2024-12-25T14:00:00Z', 'Community Arts Center', true, '/placeholder.svg?height=240&width=460&query=event image'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Creative Workshop');

-- 16. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 17. Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(email TEXT, password TEXT, full_name TEXT)
RETURNS TEXT AS $$
DECLARE
    user_id UUID;
BEGIN
    -- This function should be called manually to create admin users
    -- You'll need to use Supabase Auth API or Dashboard to create the user first
    -- Then update their profile role to 'admin'
    
    -- Example: Update existing user to admin
    UPDATE profiles 
    SET role = 'admin'::user_role 
    WHERE id = (SELECT id FROM auth.users WHERE email = $1);
    
    RETURN 'Admin user created successfully';
EXCEPTION WHEN OTHERS THEN
    RETURN 'Error creating admin user: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$ BEGIN
    RAISE NOTICE 'Team Wolv database setup completed successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create an admin user in Authentication > Users';
    RAISE NOTICE '2. Update their profile role to admin in the profiles table';
    RAISE NOTICE '3. Deploy your app to Vercel';
    RAISE NOTICE '4. Add environment variables in Vercel dashboard';
END $$;
