import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
   const { pathname } = req.nextUrl;

   // If authenticated and tries to access login/signup, redirect to home
   if (
      token &&
      (pathname.startsWith('/auth/login') ||
         pathname.startsWith('/auth/signup'))
   ) {
      return NextResponse.redirect(new URL('/', req.url));
   }

   // Protect profile page - requires authentication
   if (pathname.startsWith('/profile') && !token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/profile/:path*', '/auth/login', '/auth/signup'],
};
