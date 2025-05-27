import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { AuthLayout } from '~/components/auth/AuthLayout';
import { LoginForm } from '~/components/auth/LoginForm';
import { createServerSupabaseClient } from '~/lib/supabase/auth.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login | AppFit' },
    { name: 'description', content: 'Log in to your AppFit account' },
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

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
