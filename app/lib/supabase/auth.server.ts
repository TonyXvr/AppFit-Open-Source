// For server-side, we'll create a minimal implementation
// This will be replaced by the CDN version on the client side
import { redirect } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';

// Supabase configuration
// Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client for server-side operations
export const createServerSupabaseClient = ({ request }: {
  request: Request;
  context?: AppLoadContext;
}) => {
  // Get the session cookie from the request
  const cookies = request.headers.get('Cookie') || '';
  const authCookie = cookies.split(';').find(c => c.trim().startsWith('sb-auth='));
  const authToken = authCookie ? authCookie.split('=')[1].trim() : null;

  // Create a minimal Supabase client for server-side
  // This is a placeholder that will be replaced by the actual client on the client side
  const supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null } }),
      signUp: () => Promise.resolve({ data: { user: null } }),
      signOut: () => Promise.resolve({}),
      exchangeCodeForSession: () => Promise.resolve({})
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          gte: () => ({
            single: () => Promise.resolve({ data: null })
          })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      insert: () => Promise.resolve({ error: null })
    })
  };

  return supabase;
};

// Helper function to require authentication
export async function requireAuth({ request, context, redirectTo = '/login' }: {
  request: Request;
  context?: AppLoadContext;
  redirectTo?: string;
}) {
  const supabaseClient = createServerSupabaseClient({ request });
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    // Save the current URL to redirect back after login
    const url = new URL(request.url);
    const returnTo = url.pathname + url.search;

    throw redirect(`${redirectTo}?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return {
    supabaseClient,
    session,
    user: session.user,
  };
}

// Helper function to get user message count for the day
export async function getUserMessageCount({ request }: {
  request: Request;
  context?: AppLoadContext;
}) {
  const { supabaseClient, user } = await requireAuth({ request });

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Query the message count for today
  const { data, error } = await supabaseClient
    .from('user_messages')
    .select('count')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())
    .single();

  if (error && error.code !== 'PGSQL_ERROR_NO_DATA_FOUND') {
    console.error('Error fetching message count:', error);
    return 0;
  }

  return data?.count || 0;
}

// Helper function to increment user message count
export async function incrementUserMessageCount({ request }: {
  request: Request;
  context?: AppLoadContext;
}) {
  const { supabaseClient, user } = await requireAuth({ request });

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's an entry for today
  const { data: existingData } = await supabaseClient
    .from('user_messages')
    .select('id, count')
    .eq('user_id', user.id)
    .gte('created_at', today.toISOString())
    .single();

  if (existingData) {
    // Update existing entry
    const { error } = await supabaseClient
      .from('user_messages')
      .update({ count: existingData.count + 1 })
      .eq('id', existingData.id);

    if (error) {
      console.error('Error incrementing message count:', error);
    }

    return existingData.count + 1;
  } else {
    // Create new entry
    const { error } = await supabaseClient
      .from('user_messages')
      .insert({ user_id: user.id, count: 1 });

    if (error) {
      console.error('Error creating message count:', error);
    }

    return 1;
  }
}
