'use server';

import { createAdminClient } from '@/lib/appwrite/admin';
import { createSessionClient } from '@/lib/appwrite/server';
import { OAuthProvider } from 'node-appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DATABASE_ID, USERS_COLLECTION_ID } from '@/config/appwrite';
import { ID, Query } from 'node-appwrite';

// Step 1: Login button এ click করলে এটা call হয়
export async function signInWithGoogle() {
  const { account } = await createAdminClient();

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    `${process.env.NEXT_PUBLIC_APP_URL}/login`
  );

  redirect(redirectUrl);
}

// Step 3: Callback এ session বানাই
export async function createSessionFromToken(userId: string, secret: string) {
  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure = isProduction;

  cookieStore.set('appwrite-session', session.secret, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
  });

  return session;
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
  } catch {}

  const cookieStore = await cookies();
  cookieStore.delete('appwrite-session');
  redirect('/');
}

export async function getSession() {
  try {
    const { account, databases } = await createSessionClient();
    const authUser = await account.get();

    let userDoc = null;
    let userAvatar = undefined;
    
    // Try to get document directly by auth user ID
    try {
      userDoc = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        authUser.$id
      );
    } catch {
      // Try query by email
      if (authUser.email) {
        let result = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal('email', authUser.email)]
        );
        if (result.documents?.length) {
          userDoc = result.documents[0];
        }
      }
      
      // Try query by name if still not found
      if (!userDoc && authUser.name) {
        let result = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal('name', authUser.name)]
        );
        if (result.documents?.length) {
          userDoc = result.documents[0];
        }
      }
    }

    userAvatar = userDoc?.avatarUrl;
    
    return {
      user: authUser,
      role: userDoc?.role ?? 'student',
      userDoc,
      userAvatar,
    };
  } catch (e) {
    console.error('Session Error:', e);
    return null;
  }
}

export async function refreshUserRoleCookie(userId: string) {
  const { databases } = await createAdminClient();
  const userDoc = await databases.getDocument(
    DATABASE_ID,
    USERS_COLLECTION_ID,
    userId
  );
  const cookieStore = await cookies();
  cookieStore.set('appwrite-user-role', userDoc.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}
