import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite/server';
import { cookies } from 'next/headers';

function clearAllAuthCookies(cookieStore: any) {
  const cookieOptions = { path: '/', maxAge: 0, expires: new Date(0) };
  cookieStore.set('appwrite-session', '', cookieOptions);
  cookieStore.set('appwrite-user-role', '', cookieOptions);
  cookieStore.set('appwrite-user-name', '', cookieOptions);
  cookieStore.set('appwrite-user-email', '', cookieOptions);
  cookieStore.delete('appwrite-session');
  cookieStore.delete('appwrite-user-role');
  cookieStore.delete('appwrite-user-name');
  cookieStore.delete('appwrite-user-email');
}

export async function POST() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
  } catch {}

  const cookieStore = await cookies();
  clearAllAuthCookies(cookieStore);

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession('current');
  } catch {}

  const cookieStore = await cookies();
  clearAllAuthCookies(cookieStore);

  return NextResponse.redirect(new URL('/login', request.url));
}
