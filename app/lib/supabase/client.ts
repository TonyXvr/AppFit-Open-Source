// Supabase configuration
// Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables
// Get these from your Supabase project settings: https://supabase.com/dashboard/project/[project-id]/settings/api
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client
let supabase: any;

// Use the global Supabase object when in the browser
if (typeof window !== 'undefined' && (window as any).supabase) {
  supabase = (window as any).supabase.createClient(supabaseUrl, supabaseAnonKey);
} else {
  // For server-side rendering, create a placeholder
  // This will be replaced with the actual client on the client side
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null } }),
      signUp: () => Promise.resolve({ data: { user: null } }),
      signOut: () => Promise.resolve({}),
    }
  };
}

export { supabase };

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
