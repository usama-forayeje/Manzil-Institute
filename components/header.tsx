import { getSession } from '@/lib/auth/actions';
import HeroHeaderClient from './header-client';

/**
 * Server component that fetches the session and passes it to the client header.
 * This avoids the client component needing to call getSession() directly.
 */
export default async function HeroHeader() {
  const session = await getSession();

  const initialSession = session?.user
    ? {
        user: {
          $id: session.user.$id,
          name: session.user.name || 'User',
          email: session.user.email || '',
        },
        role: session.role || 'student',
        userAvatar: session.userAvatar,
      }
    : null;

  return <HeroHeaderClient initialSession={initialSession} />;
}

// Client-compatible version for use in client components
export function ClientHeader() {
  return <HeroHeaderClient initialSession={null} />;
}
