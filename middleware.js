import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname, search } = request.nextUrl;
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

  if (
    token &&
    (pathname === '/login' || pathname === '/signup')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/practice/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};