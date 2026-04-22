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
   WORKER_DASHBOARD: '/worker/dashboard',
} as const;

/**
 * User roles for authorization checks
 */
const USER_ROLES = {
   ADMIN: 'admin',
   WORKER: 'worker',
} as const;

/**
 * Route prefixes for path matching
 */
const PROTECTED_PATHS = {
   ADMIN: '/admin',
   WORKER: '/worker',
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
 * Checks if pathname is a worker route
 * @param pathname - The request pathname
 * @returns True if worker route, false otherwise
 */
function isWorkerRoute(pathname: string): boolean {
   return pathname.startsWith(PROTECTED_PATHS.WORKER);
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
 * Checks if user has worker role
 * @param token - The JWT token from next-auth
 * @returns True if worker, false otherwise
 */
function isWorker(token: AuthToken | null): boolean {
   return token?.role === USER_ROLES.WORKER;
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
 * Gets the appropriate redirect path for an authenticated user based on role
 * @param token - The JWT token from next-auth
 * @returns The appropriate route path for the user
 */
function getRoleBasedRedirectPath(token: AuthToken | null): string {
   if (isAdmin(token)) return ROUTES.ADMIN_DASHBOARD;
   if (isWorker(token)) return ROUTES.WORKER_DASHBOARD;
   return ROUTES.HOME;
}

/**
 * Middleware handler for route protection and authentication
 * Handles four scenarios:
 * 1. Admin routes: Requires authentication + admin role
 * 2. Worker routes: Requires authentication + worker role
 * 3. Auth routes (login/signup): Redirect authenticated users away
 * 4. Profile routes: Requires authentication
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

   // Scenario 2: Protect worker routes - requires worker role
   if (isWorkerRoute(pathname)) {
      if (!isAuthenticated(token)) {
         // Not logged in, send to login
         return redirectTo(req, ROUTES.LOGIN);
      }

      if (!isWorker(token)) {
         // Logged in but not worker, send to home
         return redirectTo(req, ROUTES.HOME);
      }

      // Worker user accessing worker route - allow
      return NextResponse.next();
   }

   // Scenario 3: Redirect authenticated users away from auth pages
   if (isAuthRoute(pathname) && isAuthenticated(token)) {
      const redirectPath = getRoleBasedRedirectPath(token);
      return redirectTo(req, redirectPath);
   }

   // Scenario 4: Protect profile routes - requires authentication
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
      // Worker routes
      '/worker/:path*',
      // Auth routes
      '/auth/login',
      '/auth/signup',
      // Profile routes
      '/profile/:path*',
   ],
};
