import { create } from 'zustand';
import { supabase, isDummySupabase } from '@/services/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  // When session is set, also sync the user from it
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    if (!isDummySupabase) {
      await supabase.auth.signOut();
    }
    // Always clear local state regardless of supabase response
    set({ user: null, session: null });
  },
}));
