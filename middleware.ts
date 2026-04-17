import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, ROLE_DASHBOARD } from './config/appwrite';

// Next.js middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('appwrite-session');

  // Skip static files and API routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Redirect logged‑in users from /login
  if (pathname === '/login') {
    if (session?.value) {
      const role = request.cookies.get('appwrite-user-role')?.value;
      if (role && ROLE_DASHBOARD[role as UserRole]) {
        return NextResponse.redirect(
          new URL(ROLE_DASHBOARD[role as UserRole], request.url)
        );
      }
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
    return NextResponse.next();
  }

  // Role-based dashboard access
  if (pathname.startsWith('/dashboard')) {
    if (!session?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = request.cookies.get('appwrite-user-role')?.value as UserRole;
    const allowedRolesForPath: Record<string, UserRole[]> = {
      '/dashboard/admin': ['super_admin'],
      '/dashboard/manager': ['super_admin', 'manager'],
      '/dashboard/teacher': ['super_admin', 'manager', 'teacher'],
      '/dashboard/student': ['super_admin', 'manager', 'teacher', 'student'],
      '/dashboard/parent': ['super_admin', 'manager', 'parent'],
    };

    const matchedPath = Object.keys(allowedRolesForPath).find(path =>
      pathname.startsWith(path)
    );
    if (
      matchedPath &&
      role &&
      !allowedRolesForPath[matchedPath].includes(role)
    ) {
      if (ROLE_DASHBOARD[role]) {
        return NextResponse.redirect(
          new URL(ROLE_DASHBOARD[role], request.url)
        );
      }
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  // Allow public routes
  const publicPaths = [
    '/',
    '/api/auth/callback',
    '/apply/staff',
    '/curriculum',
    '/curriculum/mnc',
    '/curriculum/mic',
    '/campus',
  ];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Config export for matcher
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
