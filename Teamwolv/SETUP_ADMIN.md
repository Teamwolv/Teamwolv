# Admin Setup Guide

## Quick Admin Account Setup

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to Authentication → Users
   - Click "Add User" or "Invite User"

2. **Create Admin User**
   - Email: `admin@teamwolv.com` (or your preferred email)
   - Password: Choose a strong password
   - **Important**: After creating the user, click on the user and go to "User Metadata"
   - Add: `{"role": "admin"}` in the metadata field
   - Save the changes

3. **Test Login**
   - Go to `http://localhost:3000/auth/signin`
   - Use the email and password you created
   - You should be redirected to the admin panel

### Method 2: Using SQL (Advanced)

Run this SQL in your Supabase SQL Editor:

```sql
-- First, create a user (you'll need to do this through Supabase Auth UI)
-- Then update their role to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Method 3: Using the Signup Page

1. Go to `http://localhost:3000/auth/signup`
2. Create an account with your email
3. After account creation, update the user's role in Supabase Dashboard:
   - Go to Authentication → Users
   - Find your user
   - Edit User Metadata
   - Add: `{"role": "admin"}`
   - Save

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### "Failed to fetch" Error
- Check your Supabase URL and keys in `.env.local`
- Make sure your Supabase project is active
- Check your internet connection

### "Invalid email or password" Error
- Make sure the user exists in Supabase
- Check if the user is confirmed (not pending)
- Verify the password is correct

### "Access Denied" in Admin Panel
- Make sure the user has `role: "admin"` in their metadata
- Check the user's profile in the profiles table

## Features Available to Admin

- ✅ Event Management
- ✅ User Management  
- ✅ Site Settings
- ✅ Gallery Management
- ✅ Aftermovies Management
- ✅ Profile Management

## Next Steps

1. Set up your admin account using one of the methods above
2. Test the login functionality
3. Explore the admin panel features
4. Customize site settings as needed

---

**Need Help?** Check the console for detailed error messages and ensure all environment variables are properly configured.
