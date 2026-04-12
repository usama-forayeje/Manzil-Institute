'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

// Serialized user type safe for client components
export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  /** Initial session data passed from server component */
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

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from initial session on mount
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
    setIsLoading(false);
  }, [initialSession]);

  // Refresh session by calling server action
  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { getSession } = await import('@/lib/auth/actions');
      const session = await getSession();
      if (session?.user) {
        setUser({
          uid: session.user.$id,
          name: session.user.name || 'User',
          email: session.user.email || '',
          avatar: session.userAvatar,
          role: session.role || 'student',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
