/**
 * This file initializes the Supabase client on the client side
 * It's imported in the client entry point to ensure it runs early
 */

// Check if we're in the browser
if (typeof window !== 'undefined') {
  // Wait for the Supabase script to load
  window.addEventListener('DOMContentLoaded', () => {
    // Check if the Supabase global object is available
    const checkSupabase = () => {
      if ((window as any).supabase) {
        console.log('Supabase client initialized from CDN');
      } else {
        // If not available yet, try again in 100ms
        setTimeout(checkSupabase, 100);
      }
    };

    // Start checking
    checkSupabase();
  });
}

export {};
