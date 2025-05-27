import { redirect, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { createServerSupabaseClient } from '~/lib/supabase/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const supabaseClient = createServerSupabaseClient({ request });

  // Sign out the user
  await supabaseClient.auth.signOut();

  // Redirect to the home page
  return redirect('/');
};

export const loader = async () => {
  // If someone navigates to this route directly, redirect them to the home page
  return redirect('/');
};
