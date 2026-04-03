import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, ROLE_DASHBOARD } from './config/appwrite';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('appwrite-session');

  // 1. Redirect logged‑in users away from /login based on their role
  if (pathname === '/login') {
    if (session?.value) {
      const role = request.cookies.get('appwrite-user-role')?.value;
      if (role && ROLE_DASHBOARD[role as UserRole]) {
        return NextResponse.redirect(new URL(ROLE_DASHBOARD[role as UserRole], request.url));
      }
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
    return NextResponse.next();
  }

  // middleware.ts - dashboard রুটের জন্য রোল চেক
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

    // find which dashboard path the user is trying to access
    const matchedPath = Object.keys(allowedRolesForPath).find(path =>
      pathname.startsWith(path)
    );
    if (
      matchedPath &&
      role &&
      !allowedRolesForPath[matchedPath].includes(role)
    ) {
      // Redirect to their own dashboard
      if (ROLE_DASHBOARD[role]) {
        return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], request.url));
      }
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }
  }

  // 2. Public routes (no session required)
  const publicPaths = ['/', '/api/auth/callback'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session?.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // session exists – let the dashboard layout handle RBAC
  }

  // 4. All other routes are allowed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
