# Supabase Authentication Setup

This document provides instructions for setting up Supabase authentication in the AppFit application.

## Required Dependencies

Before using the authentication features, you need to install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

Or if you're using pnpm:

```bash
pnpm add @supabase/supabase-js
```

## Supabase Project Setup

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Get your project URL and anon key from Project Settings → API
3. Add these to your `.env.local` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```
4. Set up the database schema by running the SQL in `supabase/schema.sql` in the SQL Editor in your Supabase dashboard

## Authentication Features

The authentication implementation includes:

1. User sign-up and login
2. Message limit tracking (5 messages per day)
3. Protected routes
4. Authentication state management

## Files Overview

- `app/lib/supabase/client.ts` - Client-side Supabase client
- `app/lib/supabase/auth.server.ts` - Server-side authentication utilities
- `app/lib/stores/auth.ts` - Authentication state store
- `app/components/auth/LoginForm.tsx` - Login form component
- `app/components/auth/SignupForm.tsx` - Signup form component
- `app/components/auth/AuthLayout.tsx` - Authentication layout
- `app/components/header/AuthButtons.client.tsx` - Auth buttons in header
- `app/routes/login.tsx` - Login route
- `app/routes/signup.tsx` - Signup route
- `app/routes/logout.tsx` - Logout route
- `app/routes/auth.callback.tsx` - Auth callback route
- `app/lib/middleware/auth.server.ts` - Authentication middleware

## Environment Variables

For production deployment, add these environment variables to your hosting platform:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## Troubleshooting

If you encounter issues with the Supabase client, make sure:

1. The Supabase client library is installed
2. The Supabase URL and anon key are correct
3. The database schema is set up correctly
4. Authentication is enabled in your Supabase project settings
