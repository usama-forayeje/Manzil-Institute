'use server';

import { createAdminClient } from '@/lib/appwrite/admin';
import { createSessionClient, NoSessionError } from '@/lib/appwrite/server';
import { OAuthProvider } from 'node-appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DATABASE_ID, USERS_COLLECTION_ID } from '@/config/appwrite';
import { Query } from 'node-appwrite';

/**
 * Initiates Google OAuth2 sign-in flow.
 * Redirects the user to Google's consent screen.
 */
export async function signInWithGoogle() {
  const { account } = await createAdminClient();

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    `${process.env.NEXT_PUBLIC_APP_URL}/login`
  );

  redirect(redirectUrl);
}

/**
 * Creates a user session from OAuth callback credentials.
 * Sets the session cookie for subsequent requests.
 */
export async function createSessionFromToken(userId: string, secret: string) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';

    cookieStore.set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    });

    return session;
  } catch (error: any) {
    // Re-throw with more context
    throw new Error(`Session creation failed: ${error.message}`);
  }
}

/**
 * Deletes the current user session and clears the session cookie.
 */
export async function signOut() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
  } catch {
    // Session may already be invalid, continue to clear cookie
  }

  const cookieStore = await cookies();
  cookieStore.delete('appwrite-session');
}

/**
 * Retrieves the current authenticated user's session and associated user document.
 * Returns null if no session exists or if the session is invalid.
 */
export async function getSession() {
  try {
    const { account, databases } = await createSessionClient();
    const authUser = await account.get();

    const userDoc = await getUserDocument(databases, authUser);

    return {
      user: authUser,
      role: userDoc?.role ?? 'student',
      userDoc,
      userAvatar: userDoc?.avatarUrl,
    };
  } catch (e) {
    // NoSessionError is expected for unauthenticated users - return null silently
    if (e instanceof NoSessionError) {
      return null;
    }
    // Log unexpected errors for debugging
    console.error('Session Error:', e);
    return null;
  }
}

/**
 * Fetches the user document from Appwrite using multiple fallback strategies.
 */
async function getUserDocument(databases: any, authUser: any) {
  // Strategy 1: Direct document lookup by auth user ID
  try {
    return await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      authUser.$id
    );
  } catch {
    // Continue to fallback strategies
  }

  // Strategy 2: Query by email
  if (authUser.email) {
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('email', authUser.email)]
    );
    if (result.documents?.length) {
      return result.documents[0];
    }
  }

  // Strategy 3: Query by name
  if (authUser.name) {
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('name', authUser.name)]
    );
    if (result.documents?.length) {
      return result.documents[0];
    }
  }

  return null;
}

/**
 * Refreshes the user role cookie with the latest value from the database.
 * Useful after role changes to avoid stale client-side state.
 */
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
