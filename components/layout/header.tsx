import { getSession } from '@/lib/auth/actions';
import HeroHeaderClient from './header-client';

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

// Client-side fallback (যেখানে সার্ভার কম্পোনেন্ট ব্যবহার করা যাচ্ছে না)
export function ClientHeader() {
  return <HeroHeaderClient initialSession={null} />;
}