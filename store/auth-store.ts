'use client';

import { create } from 'zustand';

// Serialized user type safe for client components
export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  refreshSession: async () => {
    set({ isLoading: true });
    try {
      const { getSession } = await import('@/lib/auth/actions');
      const session = await getSession();
      if (session?.user) {
        set({
          user: {
            uid: session.user.$id,
            name: session.user.name || 'User',
            email: session.user.email || '',
            avatar: session.userAvatar,
            role: session.role || 'student',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
