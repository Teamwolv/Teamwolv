#!/bin/bash

# Team Wolv - Vercel Deployment Script
echo "🚀 Starting Team Wolv deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Add environment variables in Vercel dashboard:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo ""
    echo "2. Configure Supabase:"
    echo "   - Add your Vercel domain to Site URL"
    echo "   - Add redirect URLs"
    echo "   - Run the database schema"
    echo ""
    echo "3. Test your deployment!"
else
    echo "❌ Deployment failed. Check the logs above."
    exit 1
fi


