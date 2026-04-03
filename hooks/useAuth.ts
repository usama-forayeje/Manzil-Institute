import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Auth user type
export interface AuthUser {
  $id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'manager' | 'teacher' | 'student' | 'parent';
  avatarUrl?: string;
}

// Get current user from server
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

// Sign out
export async function signOut() {
  try {
    await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Sign out error:', error);
  }
}