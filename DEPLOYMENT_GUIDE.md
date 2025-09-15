# 🚀 Team Wolv - Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ 1. Environment Variables Setup
Make sure you have these environment variables ready:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### ✅ 2. Build Test
Test your build locally:
```bash
cd Frontend/Teamwolv
npm run build
npm start
```

### ✅ 3. Database Setup
- Ensure your Supabase database is properly configured
- Run the SQL schema from `supabase-schema.sql`
- Set up RLS policies
- Create admin user

## Vercel Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to your project:**
   ```bash
   cd Frontend/Teamwolv
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - Project name: `team-wolv` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? `N`

6. **Set Environment Variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

7. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub/GitLab/Bitbucket**
3. **Click "New Project"**
4. **Import your repository**
5. **Configure project:**
   - Framework Preset: `Next.js`
   - Root Directory: `Frontend/Teamwolv`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables

7. **Deploy:**
   - Click "Deploy"

## Post-Deployment Steps

### ✅ 1. Test Your Live Site
- Visit your Vercel URL
- Test all admin functionality
- Test event adding/deleting
- Test authentication

### ✅ 2. Configure Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records

### ✅ 3. Set Up Monitoring
- Enable Vercel Analytics
- Set up error monitoring
- Configure performance monitoring

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (should be 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables:**
   - Make sure all required variables are set
   - Check variable names (case-sensitive)
   - Redeploy after adding variables

3. **Database Connection:**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure database is accessible

4. **Image Loading:**
   - Check image optimization settings
   - Verify image domains in next.config.mjs
   - Use absolute URLs for external images

## Performance Optimization

### ✅ 1. Enable Vercel Analytics
Add to your layout.tsx:
```tsx
import { Analytics } from '@vercel/analytics/react'
```

### ✅ 2. Optimize Images
- Use Next.js Image component
- Enable image optimization
- Use WebP/AVIF formats

### ✅ 3. Enable Caching
- Set up proper cache headers
- Use Vercel's edge caching
- Optimize API routes

## Security Checklist

- ✅ Environment variables are secure
- ✅ No sensitive data in client code
- ✅ Proper CORS configuration
- ✅ Security headers configured
- ✅ RLS policies enabled

## Monitoring & Maintenance

1. **Set up alerts for:**
   - Build failures
   - High error rates
   - Performance issues

2. **Regular maintenance:**
   - Update dependencies
   - Monitor performance
   - Check error logs

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Test locally first

---

**Your Team Wolv site should now be live on Vercel! 🎉**


