# Supabase Authentication Setup

This directory contains the necessary files to set up Supabase authentication for the AppFit application.

## Prerequisites

1. A Supabase account
2. The Supabase CLI installed (optional, for local development)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-remix
```

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL and anon key from Project Settings → API
3. Add these to your `.env.local` file (see main README.md for details)

### 3. Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `schema.sql` and run it to create the necessary tables and policies

### 4. Configure Authentication

1. In the Supabase dashboard, go to Authentication > Settings
2. Configure the Site URL to match your application's URL
3. Enable Email/Password sign-in method
4. (Optional) Configure additional sign-in methods like OAuth providers

### 5. Environment Variables

Add the following environment variables to your project:

```
SUPABASE_URL=https://knnupbajpguynkcmfnto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubnVwYmFqcGd1eW5rY21mbnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMTcwNjMsImV4cCI6MjA1ODc5MzA2M30.9AI8R4jqClPW-xR8YKu7fZiOHqkFMH8-6dfOznyDlNg
```

## Database Schema

The database schema includes the following tables:

1. `user_profiles` - Additional user information
2. `user_messages` - Tracks message usage per day
3. `user_projects` - Stores user projects
4. `user_chats` - Stores chat history

## Row Level Security

Row Level Security (RLS) is enabled on all tables to ensure users can only access their own data.

## Authentication Flow

1. Users sign up or log in through the `/signup` or `/login` routes
2. Upon successful authentication, they are redirected to the home page
3. The application tracks message usage and enforces a limit of 5 messages per day
4. Users can log out through the `/logout` route

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Remix](https://supabase.com/docs/guides/auth/auth-helpers/remix)
