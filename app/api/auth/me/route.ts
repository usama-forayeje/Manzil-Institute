import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/actions';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        $id: session.user.$id,
        name: session.user.name,
        email: session.user.email,
      },
      role: session.role,
      userDoc: session.userDoc,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}