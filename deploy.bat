@echo off
echo 🚀 Starting Team Wolv deployment to Vercel...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if user is logged in
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 Please login to Vercel first:
    vercel login
)

REM Build the project first
echo 📦 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod

if %errorlevel% eq 0 (
    echo ✅ Deployment successful!
    echo.
    echo 🔧 Next steps:
    echo 1. Add environment variables in Vercel dashboard:
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo    - NEXT_PUBLIC_APP_URL
    echo.
    echo 2. Configure Supabase:
    echo    - Add your Vercel domain to Site URL
    echo    - Add redirect URLs
    echo    - Run the database schema
    echo.
    echo 3. Test your deployment!
) else (
    echo ❌ Deployment failed. Check the logs above.
    pause
    exit /b 1
)

pause


