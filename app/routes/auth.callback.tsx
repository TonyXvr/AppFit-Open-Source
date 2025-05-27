import { redirect, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { createServerSupabaseClient } from '~/lib/supabase/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const supabaseClient = createServerSupabaseClient({ request });
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page or a specific page after authentication
  return redirect('/');
};
