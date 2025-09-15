# Team Wolv Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
- [ ] Copy `.env.local` to `.env.example` (remove sensitive values)
- [ ] Prepare environment variables for Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`

### 2. Database Setup
- [ ] Run the complete `supabase-schema.sql` in your Supabase dashboard
- [ ] Create admin user with proper role
- [ ] Test all database functions work

### 3. Code Optimization
- [ ] Ensure all performance optimizations are applied
- [ ] Test the application locally (`npm run dev`)
- [ ] Check for any console errors
- [ ] Verify all pages load correctly

### 4. Git Repository
- [ ] Initialize git repository
- [ ] Add all files to git
- [ ] Create initial commit
- [ ] Push to GitHub

## Vercel Deployment Steps

### 1. Create Vercel Account
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign up with GitHub account
- [ ] Connect GitHub repository

### 2. Configure Project
- [ ] Framework: Next.js
- [ ] Root Directory: `Frontend/Teamwolv`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### 3. Environment Variables
- [ ] Add all required environment variables in Vercel dashboard
- [ ] Set production URLs

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Test the live application

## Post-Deployment

### 1. Test Everything
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] All pages load without errors
- [ ] Database connections work

### 2. Performance Check
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test on mobile devices

### 3. Domain Setup (Optional)
- [ ] Add custom domain if needed
- [ ] Configure SSL certificate
- [ ] Set up redirects

## Troubleshooting

### Common Issues:
1. **Build Errors**: Check console for TypeScript/ESLint errors
2. **Environment Variables**: Ensure all are set correctly
3. **Database Connection**: Verify Supabase URL and keys
4. **Image Loading**: Check image paths and optimization

### Performance Tips:
1. **Enable Vercel Analytics** for monitoring
2. **Use Vercel's Image Optimization** for better performance
3. **Enable Edge Functions** for faster API responses
4. **Set up caching headers** for static assets

## Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Integration: https://supabase.com/docs/guides/getting-started


