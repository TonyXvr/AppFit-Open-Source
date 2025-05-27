import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';

export const meta: MetaFunction = () => {
  return [{ title: 'VibeCoder' }, { name: 'description', content: 'Talk with VibeCoder, your AI coding assistant' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // We don't require authentication here, but we'll check if the user is authenticated
  // to display the appropriate UI
  try {
    // Import here to avoid server-side issues
    const { createServerSupabaseClient } = await import('~/lib/supabase/auth.server');
    const supabaseClient = createServerSupabaseClient({ request });
    const { data: { session } } = await supabaseClient.auth.getSession();

    return json({
      isAuthenticated: !!session,
      user: session?.user || null,
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return json({
      isAuthenticated: false,
      user: null,
    });
  }
};

/**
 * Landing page component for VibeCoder
 * Note: Settings functionality should ONLY be accessed through the sidebar menu.
 * Do not add settings button/panel to this landing page as it was intentionally removed
 * to keep the UI clean and consistent with the design system.
 */
export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
    </div>
  );
}
