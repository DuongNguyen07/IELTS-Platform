import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = request.nextUrl;

  // Admin routes — JWT role check (no DB call)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    if ((token as { role?: string }).role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected user routes
  if (
    !token &&
    (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/practice') ||
      pathname.startsWith('/progress') ||
      pathname.startsWith('/profile')
    )
  ) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/practice/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};
