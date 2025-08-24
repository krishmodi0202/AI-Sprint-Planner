# AI Sprint Planner - Setup Guide

## Authentication & Database Setup

### 1. Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your Publishable Key
4. Update `.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### 2. Configure OAuth Providers in Clerk

#### Google OAuth:
1. In Clerk Dashboard, go to "User & Authentication" → "Social Connections"
2. Enable Google
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk

#### Facebook OAuth:
1. In Clerk Dashboard, enable Facebook
2. Add your Facebook App credentials:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login product
   - Copy App ID and App Secret to Clerk

### 3. Supabase Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Copy your project URL and anon key
4. Update `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Database Schema

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sprint_plans table
CREATE TABLE sprint_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES users(clerk_id) ON DELETE CASCADE,
  prd_text TEXT NOT NULL,
  sprint_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_sprint_plans_user_id ON sprint_plans(user_id);
CREATE INDEX idx_sprint_plans_created_at ON sprint_plans(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprint_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view own sprint plans" ON sprint_plans
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create own sprint plans" ON sprint_plans
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own sprint plans" ON sprint_plans
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own sprint plans" ON sprint_plans
  FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

## Installation & Running

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the backend server:
   ```bash
   cd ../server
   npm install
   npm start
   ```

## Features

- ✅ Modern UI with animations (Framer Motion)
- ✅ Authentication with Clerk (Google & Facebook OAuth)
- ✅ Supabase database integration
- ✅ Protected routes
- ✅ User session management
- ✅ Sprint plan persistence
- ✅ Responsive design
- ✅ Real-time animations and interactions

## Environment Variables

Create `.env.local` in the client directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## OAuth Provider Configuration

### Google OAuth Setup:
1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs from Clerk Dashboard
4. Copy Client ID and Secret to Clerk

### Facebook OAuth Setup:
1. Facebook Developers → Create App
2. Add Facebook Login product
3. Configure Valid OAuth Redirect URIs from Clerk
4. Copy App ID and Secret to Clerk

## Troubleshooting

- Ensure all environment variables are set correctly
- Check Clerk Dashboard for OAuth provider status
- Verify Supabase database schema is created
- Check browser console for authentication errors
