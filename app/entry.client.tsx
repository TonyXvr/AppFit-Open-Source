import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Initialize Supabase client
import './lib/supabase/init-client';

startTransition(() => {
  hydrateRoot(document.getElementById('root')!, <RemixBrowser />);
});
