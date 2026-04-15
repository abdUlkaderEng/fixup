import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Route constants for centralized routing configuration
 */
const ROUTES = {
   HOME: '/',
   LOGIN: '/auth/login',
   ADMIN_DASHBOARD: '/admin/dashboard',
} as const;

/**
 * User roles for authorization checks
 */
const USER_ROLES = {
   ADMIN: 'admin',
} as const;

/**
 * Route prefixes for path matching
 */
const PROTECTED_PATHS = {
   ADMIN: '/admin',
   AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
   },
   PROFILE: '/profile',
} as const;

/**
 * Type for JWT token with role information
 */
interface AuthToken {
   role?: string;
}

/**
 * Checks if pathname is an admin route
 * @param pathname - The request pathname
 * @returns True if admin route, false otherwise
 */
function isAdminRoute(pathname: string): boolean {
   return pathname.startsWith(PROTECTED_PATHS.ADMIN);
}

/**
 * Checks if pathname is an authentication route
 * @param pathname - The request pathname
 * @returns True if auth route, false otherwise
 */
function isAuthRoute(pathname: string): boolean {
   return (
      pathname.startsWith(PROTECTED_PATHS.AUTH.LOGIN) ||
      pathname.startsWith(PROTECTED_PATHS.AUTH.SIGNUP)
   );
}

/**
 * Checks if pathname is a profile route
 * @param pathname - The request pathname
 * @returns True if profile route, false otherwise
 */
function isProfileRoute(pathname: string): boolean {
   return pathname.startsWith(PROTECTED_PATHS.PROFILE);
}

/**
 * Checks if user has admin role
 * @param token - The JWT token from next-auth
 * @returns True if admin, false otherwise
 */
function isAdmin(token: AuthToken | null): boolean {
   return token?.role === USER_ROLES.ADMIN;
}

/**
 * Checks if user is authenticated
 * @param token - The JWT token from next-auth
 * @returns True if authenticated, false otherwise
 */
function isAuthenticated(token: AuthToken | null): boolean {
   return token !== null;
}

/**
 * Creates redirect response to specified path
 * @param req - The NextRequest object
 * @param path - The path to redirect to
 * @returns NextResponse redirect
 */
function redirectTo(req: NextRequest, path: string): NextResponse {
   return NextResponse.redirect(new URL(path, req.url));
}

/**
 * Middleware handler for route protection and authentication
 * Handles three scenarios:
 * 1. Admin routes: Requires authentication + admin role
 * 2. Auth routes (login/signup): Redirect authenticated users away
 * 3. Profile routes: Requires authentication
 *
 * @param req - The incoming NextRequest
 * @returns NextResponse (redirect or continue)
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
   const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
   })) as AuthToken | null;

   const { pathname } = req.nextUrl;

   // Scenario 1: Protect admin routes - requires admin role
   if (isAdminRoute(pathname)) {
      if (!isAuthenticated(token)) {
         // Not logged in, send to login
         return redirectTo(req, ROUTES.LOGIN);
      }

      if (!isAdmin(token)) {
         // Logged in but not admin, send to home
         return redirectTo(req, ROUTES.HOME);
      }

      // Admin user accessing admin route - allow
      return NextResponse.next();
   }

   // Scenario 2: Redirect authenticated users away from auth pages
   if (isAuthRoute(pathname) && isAuthenticated(token)) {
      // If admin, redirect to admin dashboard instead of home
      const redirectPath = isAdmin(token)
         ? ROUTES.ADMIN_DASHBOARD
         : ROUTES.HOME;
      return redirectTo(req, redirectPath);
   }

   // Scenario 3: Protect profile routes - requires authentication
   if (isProfileRoute(pathname) && !isAuthenticated(token)) {
      return redirectTo(req, ROUTES.LOGIN);
   }

   // Allow all other requests
   return NextResponse.next();
}

/**
 * Middleware matcher configuration
 * Defines which routes trigger the middleware
 */
export const config = {
   matcher: [
      // Admin routes
      '/admin/:path*',
      // Auth routes
      '/auth/login',
      '/auth/signup',
      // Profile routes
      '/profile/:path*',
   ],
};
