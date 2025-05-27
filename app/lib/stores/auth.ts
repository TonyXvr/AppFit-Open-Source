import { atom } from 'nanostores';
import { supabase, getCurrentUser } from '~/lib/supabase/client';
import { logStore } from '~/lib/stores/logs';
import type { User } from '@supabase/supabase-js';

// Store for authentication state
export const authStore = atom<{
  user: User | null;
  isLoading: boolean;
  messageCount: number;
  maxMessagesPerDay: number;
}>({
  user: null,
  isLoading: true,
  messageCount: 0,
  maxMessagesPerDay: 10, // 10 messages per day limit
});

// Authentication actions
export const authActions = {
  // Initialize auth state
  async init() {
    try {
      authStore.set({ ...authStore.get(), isLoading: true });

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;

        // Get message count for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('user_messages')
          .select('count')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString())
          .single();

        if (error && error.code !== 'PGSQL_ERROR_NO_DATA_FOUND') {
          console.error('Error fetching message count:', error);
        }

        authStore.set({
          user,
          isLoading: false,
          messageCount: data?.count || 0,
          maxMessagesPerDay: 10,
        });

        logStore.logAuth('token_refresh', true);
      } else {
        authStore.set({
          user: null,
          isLoading: false,
          messageCount: 0,
          maxMessagesPerDay: 10,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      logStore.logAuth('token_refresh', false, { error });

      authStore.set({
        user: null,
        isLoading: false,
        messageCount: 0,
        maxMessagesPerDay: 10,
      });
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      authStore.set({
        ...authStore.get(),
        user: data.user,
      });

      logStore.logAuth('login', true);
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      logStore.logAuth('login', false, { error });
      return { success: false, error };
    }
  },

  // Sign up with email and password
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Note: User will need to verify email before being fully authenticated

      logStore.logAuth('signup', true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing up:', error);
      logStore.logAuth('signup', false, { error });
      return { success: false, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      await supabase.auth.signOut();

      authStore.set({
        user: null,
        isLoading: false,
        messageCount: 0,
        maxMessagesPerDay: 10,
      });

      logStore.logAuth('logout', true);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      logStore.logAuth('logout', false, { error });
      return { success: false, error };
    }
  },

  // Increment message count
  async incrementMessageCount() {
    const currentState = authStore.get();
    const { user, messageCount } = currentState;

    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's an entry for today
      const { data: existingData } = await supabase
        .from('user_messages')
        .select('id, count')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .single();

      let newCount = messageCount + 1;

      if (existingData) {
        // Update existing entry
        const { error } = await supabase
          .from('user_messages')
          .update({ count: existingData.count + 1 })
          .eq('id', existingData.id);

        if (error) {
          throw error;
        }

        newCount = existingData.count + 1;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('user_messages')
          .insert({ user_id: user.id, count: 1 });

        if (error) {
          throw error;
        }

        newCount = 1;
      }

      authStore.set({
        ...currentState,
        messageCount: newCount,
      });

      return { success: true, count: newCount };
    } catch (error) {
      console.error('Error incrementing message count:', error);
      return { success: false, error };
    }
  },

  // Check if user can send more messages today
  canSendMoreMessages() {
    const { user, messageCount, maxMessagesPerDay } = authStore.get();

    if (!user) {
      return false;
    }

    return messageCount < maxMessagesPerDay;
  },

  // Get remaining messages for today
  getRemainingMessages() {
    const { user, messageCount, maxMessagesPerDay } = authStore.get();

    if (!user) {
      return 0;
    }

    return Math.max(0, maxMessagesPerDay - messageCount);
  },
};

// Initialize auth state when the module is loaded
if (typeof window !== 'undefined') {
  authActions.init();

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      authActions.init();
    } else if (event === 'SIGNED_OUT') {
      authStore.set({
        user: null,
        isLoading: false,
        messageCount: 0,
        maxMessagesPerDay: 10,
      });
    }
  });
}
