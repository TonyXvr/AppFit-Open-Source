import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { AuthLayout } from '~/components/auth/AuthLayout';
import { SignupForm } from '~/components/auth/SignupForm';
import { createServerSupabaseClient } from '~/lib/supabase/auth.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign Up | AppFit' },
    { name: 'description', content: 'Create an AppFit account' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Check if user is already logged in
  const supabaseClient = createServerSupabaseClient({ request });
  const { data: { session } } = await supabaseClient.auth.getSession();

  // If user is already logged in, redirect to home page
  if (session) {
    return redirect('/');
  }

  return json({});
};

export default function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
