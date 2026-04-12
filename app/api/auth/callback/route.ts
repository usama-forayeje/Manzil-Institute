import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/appwrite/admin';
import { createSessionFromToken } from '@/lib/auth/actions';
import { DATABASE_ID, USERS_COLLECTION_ID, ROLE_DASHBOARD, UserRole } from '@/config/appwrite';
import { ID, Query } from 'node-appwrite';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  if (!userId || !secret) {
    return NextResponse.redirect(new URL('/login?error=missing_params', request.url));
  }

  try {
    // 1. Create session and set cookie (this also returns the session object)
    const session = await createSessionFromToken(userId, secret);

    // 2. Get admin client (for users & databases)
    const { users, databases } = await createAdminClient();

    // 3. Get full user info from Appwrite (name, email, etc.)
    const appwriteUser = await users.get(userId);

    // 4. Try to fetch Google avatar using the provider access token
    let avatarUrl: string | null = null;
    try {
      // We need to create a session client to get identities (the user's OAuth connections)
      const { Client, Account } = await import('node-appwrite');
      const userClient = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setSession(session.secret);

      const userAccount = new Account(userClient);
      const identities = await userAccount.listIdentities();
      const googleIdentity = identities.identities?.find(id => id.provider === 'google');

      if (googleIdentity?.providerAccessToken) {
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${googleIdentity.providerAccessToken}` },
        });
        if (googleRes.ok) {
          const googleData = await googleRes.json();
          avatarUrl = googleData.picture || null;
        }
      }
    } catch (avatarError) {
      console.warn('Failed to fetch Google avatar:', avatarError);
      // Continue without avatar – not critical
    }

    // 5. Query database by email (unique identifier)
    const existing = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('email', appwriteUser.email)]
    );

    let role = 'student';

    if (existing.total === 0) {
      // New user – create document
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          email: appwriteUser.email,
          name: appwriteUser.name || '',
          avatarUrl: avatarUrl || '',            // store avatar URL
          role: 'student',
          isActive: true,
        }
      );
    } else {
      // Existing user – update fields that might have changed (name, avatar)
      const doc = existing.documents[0];
      role = doc.role;

      // Prepare update data (only if values have changed)
      const updateData: {
        name?: string;
        email?: string;
        avatarUrl?: string;
      } = {};
      if (doc.name !== appwriteUser.name) updateData.name = appwriteUser.name;
      if (doc.email !== appwriteUser.email) updateData.email = appwriteUser.email;
      if (avatarUrl && !doc.avatarUrl) updateData.avatarUrl = avatarUrl; // only set if missing
      if (Object.keys(updateData).length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          doc.$id,
          { ...updateData }
        );
      }
    }

    // 6. (Optional) Set a signed role token for faster role checks
    //    If you want to avoid hitting the database on every request,
    //    you can create a signed JWT with the role and store it in a cookie.
    //    Example: import { createRoleToken } from '@/lib/auth/role-token';
    //    const roleToken = await createRoleToken(userId, role);
    //    (await cookies()).set('user-role-token', roleToken, { httpOnly: true, ... });

    // 7. Set role cookie for middleware and subsequent requests
    const cookieStore = await cookies();
    cookieStore.set('appwrite-user-role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    cookieStore.set('appwrite-user-name', appwriteUser.name || '', {
      httpOnly: false, // accessible to JS
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set('appwrite-user-email', appwriteUser.email || '', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    // 8. Redirect based on role
    const redirectPath = ROLE_DASHBOARD[role as UserRole] ?? '/dashboard/student';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error: any) {
    // Handle specific OAuth errors
    if (error.message?.includes('invalid_grant') || error.code === 400) {
      return NextResponse.redirect(new URL('/login?error=invalid_grant&retry=true', request.url));
    }

    // Handle other authentication errors
    if (error.message?.includes('unauthorized') || error.code === 401) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    // Generic fallback
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
  }
}