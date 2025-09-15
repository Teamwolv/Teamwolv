# Team Wolv - Event Management Platform

A modern event management platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎭 **3D Event Cards** - Interactive 3D hover effects for event displays
- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 📊 **Admin Panel** - Full-featured admin interface for managing events
- 🖼️ **File Uploads** - Image uploads to Supabase Storage
- 📱 **Responsive Design** - Mobile-first responsive design
- 🌙 **Dark Mode** - Built-in dark/light theme support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS-in-JS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (Blob storage)
- **UI Components**: Radix UI, Lucide Icons

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd "Frontend/Teamwolv"
npm install --legacy-peer-deps
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from the project settings
3. Copy the `.env.example` file to `.env.local`:

```bash
cp env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all tables, policies, and functions

### 4. Configure Storage Buckets

The SQL schema will automatically create the following storage buckets:
- `events` - For event images
- `avatars` - For user profile pictures
- `logos` - For site logos and branding

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
Frontend/Teamwolv/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Event display pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (Radix UI)
│   ├── 3d-event-card.tsx # 3D event card component
│   └── protected-route.tsx # Authentication guard
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   └── upload.ts         # File upload utilities
├── providers/            # React context providers
│   ├── auth-provider.tsx # Authentication context
│   └── site-data-provider.tsx # Data fetching context
└── supabase-schema.sql   # Database schema
```

## 3D Event Cards

The platform features interactive 3D event cards with:
- Mouse-tracking 3D rotation effects
- Smooth hover animations
- Responsive design
- Image optimization with Next.js Image component

## Authentication Flow

1. **Sign Up**: Users can create accounts with email verification
2. **Sign In**: Secure authentication with Supabase Auth
3. **Protected Routes**: Admin panel requires authentication
4. **Role-based Access**: Future implementation for admin/user roles

## File Upload System

- **Image Validation**: File type and size validation
- **Secure Storage**: Files stored in Supabase Storage buckets
- **Public URLs**: Automatic public URL generation for images
- **Cleanup**: File deletion utilities for removing old images

## Admin Panel Features

- **Dashboard**: Overview of events and site statistics
- **Event Management**: Create, edit, and delete events
- **Site Settings**: Configure site branding and content
- **User Management**: Manage user accounts and roles
- **Gallery Management**: Upload and organize site images

## Database Schema

### Tables

- **events**: Event information with images and metadata
- **profiles**: User profile information and roles
- **site_settings**: Site configuration and branding

### Security

- Row Level Security (RLS) enabled on all tables
- Public read access for events and site settings
- Authenticated users can create events
- Only admins can modify site settings

## API Endpoints

The platform uses Supabase's built-in REST API:
- `POST /rest/v1/events` - Create new events
- `GET /rest/v1/events` - Fetch events
- `PUT /rest/v1/events/:id` - Update events
- `DELETE /rest/v1/events/:id` - Delete events

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

- Set environment variables for Supabase
- Build with `npm run build`
- Serve the `out` directory

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | Yes |

## Troubleshooting

### Common Issues

1. **Dependency Conflicts**: Use `--legacy-peer-deps` flag
2. **Build Errors**: Ensure all environment variables are set
3. **Database Connection**: Verify Supabase credentials
4. **File Uploads**: Check storage bucket permissions

### Getting Help

- Check Supabase documentation for database issues
- Review Next.js documentation for frontend issues
- Check the console for detailed error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples
