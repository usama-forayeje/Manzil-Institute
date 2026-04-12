'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AuthHydrationProps {
  initialSession: {
    user: {
      $id: string;
      name: string;
      email: string;
    } | null;
    role: string;
    userAvatar?: string;
  } | null;
}

/**
 * Hydrates the Zustand auth store with server-fetched session data.
 * This component should be rendered once at the app root.
 */
export function AuthHydration({ initialSession }: AuthHydrationProps) {
  const { setUser, set } = useAuthStore.getState();

  useEffect(() => {
    if (initialSession?.user) {
      setUser({
        uid: initialSession.user.$id,
        name: initialSession.user.name || 'User',
        email: initialSession.user.email || '',
        avatar: initialSession.userAvatar,
        role: initialSession.role || 'student',
      });
    } else {
      setUser(null);
    }
  }, [initialSession, setUser]);

  return null;
}
