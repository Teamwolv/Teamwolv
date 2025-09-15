# 🔗 Vercel + Supabase Integration Guide

## Step 1: Supabase Database Setup

### 1.1 Run Database Schema
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute the schema

### 1.2 Verify Tables Created
Check that these tables exist:
- `profiles`
- `events` 
- `aftermovies`
- `site_settings`

### 1.3 Check Storage Buckets
Go to **Storage** → **Buckets** and verify:
- `events` bucket exists
- `aftermovies` bucket exists  
- `gallery` bucket exists

## Step 2: Get Supabase Credentials

### 2.1 Get Project URL and Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

### 2.2 Test Database Connection
1. Go to **Table Editor**
2. Verify you can see the tables
3. Check that RLS policies are active

## Step 3: Configure Vercel Environment Variables

### 3.1 Via Vercel CLI
```bash
# Navigate to your project
cd Frontend/Teamwolv

# Add Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://your-project-id.supabase.co

# Add Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: your_anon_key_here

# Add Service Role Key (for server-side operations)
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Enter: your_service_role_key_here

# Add App URL
vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://your-domain.vercel.app
```

### 3.2 Via Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key_here` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production, Preview, Development |

## Step 4: Configure Supabase for Production

### 4.1 Update Site URL in Supabase
1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel domain to **Site URL**:
   - `https://your-domain.vercel.app`
3. Add redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/admin`

### 4.2 Configure CORS
1. Go to **Settings** → **API**
2. Add your Vercel domain to **Additional Origins**:
   - `https://your-domain.vercel.app`

### 4.3 Enable Email Auth (Optional)
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed

## Step 5: Create Admin User

### 5.1 Method 1: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter admin email and password
4. Go to **Table Editor** → **profiles**
5. Find the user and change `role` to `admin`

### 5.2 Method 2: Via SQL
```sql
-- First create user via Supabase Auth, then run:
UPDATE profiles 
SET role = 'admin'::user_role 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com');
```

## Step 6: Test the Connection

### 6.1 Deploy to Vercel
```bash
vercel --prod
```

### 6.2 Test Database Operations
1. Visit your live site
2. Try to add an event in admin panel
3. Check if it appears in Supabase **Table Editor**
4. Test authentication flow

### 6.3 Check Vercel Logs
1. Go to Vercel Dashboard → **Functions** tab
2. Check for any errors in logs
3. Monitor performance metrics

## Step 7: Production Optimizations

### 7.1 Enable Row Level Security
- Verify RLS is enabled on all tables
- Test that users can only access their own data
- Ensure admin users can manage all data

### 7.2 Configure Storage Policies
- Verify storage buckets are accessible
- Test file uploads work correctly
- Check image loading in production

### 7.3 Set Up Monitoring
- Enable Supabase monitoring
- Set up Vercel Analytics
- Configure error tracking

## Troubleshooting

### Common Issues:

#### 1. "Invalid API key" Error
- Check that environment variables are set correctly
- Verify the anon key is correct
- Ensure variables are deployed to production

#### 2. "Row Level Security" Errors
- Check RLS policies are correctly configured
- Verify user roles are set properly
- Test with admin user account

#### 3. "CORS" Errors
- Add Vercel domain to Supabase CORS settings
- Check redirect URLs are configured
- Verify site URL is set correctly

#### 4. Database Connection Issues
- Check Supabase project is active
- Verify database is not paused
- Check network connectivity

### Debug Commands:
```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test local connection
npm run dev
```

## Security Checklist

- ✅ Environment variables are secure
- ✅ Service role key is not exposed to client
- ✅ RLS policies are properly configured
- ✅ CORS is configured correctly
- ✅ Admin users are properly created
- ✅ Storage policies are secure

## Performance Checklist

- ✅ Database queries are optimized
- ✅ Images are properly cached
- ✅ API routes are efficient
- ✅ Error handling is in place
- ✅ Loading states are implemented

---

**Your Vercel + Supabase integration should now be complete! 🎉**

Test all functionality and let me know if you encounter any issues.


