import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete the Appwrite session
    const { account } = await createSessionClient();
    await account.deleteSession('current');
  } catch {
    // Continue even if session deletion fails
  }

  // Delete the session cookie
  const cookieStore = await cookies();
  cookieStore.delete('appwrite-session');
  cookieStore.delete('appwrite-user-role');
  cookieStore.delete('appwrite-user-name');
  cookieStore.delete('appwrite-user-email');

  return NextResponse.json({ success: true });
}