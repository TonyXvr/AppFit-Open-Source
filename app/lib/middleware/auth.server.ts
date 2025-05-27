import { redirect } from '@remix-run/cloudflare';
import type { AppLoadContext } from '@remix-run/cloudflare';
import { createServerSupabaseClient } from '~/lib/supabase/auth.server';

/**
 * Middleware to require authentication for a route
 * If the user is not authenticated, they will be redirected to the login page
 */
export async function requireAuth({
  request,
  redirectTo = '/login'
}: {
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

/**
 * Middleware to check if a user has reached their message limit for the day
 * If they have, they will be redirected to a page explaining the limit
 */
export async function checkMessageLimit({
  request
}: {
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
    return { messageCount: 0, hasReachedLimit: false };
  }

  const messageCount = data?.count || 0;
  const maxMessagesPerDay = 10; // 10 messages per day limit

  if (messageCount >= maxMessagesPerDay) {
    // User has reached their message limit
    return { messageCount, hasReachedLimit: true };
  }

  return { messageCount, hasReachedLimit: false };
}
