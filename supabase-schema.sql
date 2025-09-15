-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'Team Wolv',
  site_description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aftermovies table
CREATE TABLE aftermovies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event TEXT,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('aftermovies', 'aftermovies', true);

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('events', 'logos', 'aftermovies'));
CREATE POLICY "Authenticated users can upload events" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload aftermovies" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'aftermovies' AND auth.role() = 'authenticated');

-- Set up Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aftermovies ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Profiles policies
CREATE POLICY "Users can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Site settings policies
CREATE POLICY "Public read access to site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify site settings" ON site_settings FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Aftermovies policies
CREATE POLICY "Public read access to aftermovies" ON aftermovies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create aftermovies" ON aftermovies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only admins can modify aftermovies" ON aftermovies FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Only admins can delete aftermovies" ON aftermovies FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to manually create profile for existing users
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID, user_email TEXT, user_name TEXT DEFAULT 'User', user_role TEXT DEFAULT 'user')
RETURNS VOID AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (user_id, user_email, user_name, user_role::user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aftermovies_updated_at BEFORE UPDATE ON aftermovies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO site_settings (site_name, site_description) VALUES ('Team Wolv', 'Your premier event management platform');

-- Insert sample events
INSERT INTO events (title, description, date, location, featured) VALUES
('Team Wolv Launch Party', 'Join us for the official launch of Team Wolv platform', '2024-12-15 18:00:00+00', 'Virtual Event', true),
('Tech Meetup 2024', 'Connect with fellow developers and tech enthusiasts', '2024-12-20 19:00:00+00', 'Downtown Conference Center', false),
('Creative Workshop', 'Unleash your creativity in our hands-on workshop', '2024-12-25 14:00:00+00', 'Community Arts Center', true);

-- Insert sample aftermovies
INSERT INTO aftermovies (title, description, event, video_url) VALUES
('Launch Party Highlights', 'Amazing moments from our launch event', 'Team Wolv Launch Party', 'https://example.com/video1.mp4'),
('Tech Meetup Recap', 'Best moments from the tech meetup', 'Tech Meetup 2024', 'https://example.com/video2.mp4'),
('Creative Workshop Showcase', 'Showcasing creative works from our workshop', 'Creative Workshop', 'https://example.com/video3.mp4');
