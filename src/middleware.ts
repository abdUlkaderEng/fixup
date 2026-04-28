import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ============================================
// Configuration
// ============================================

const ROUTES = {
   HOME: '/',
   LOGIN: '/auth/login',
   ADMIN_DASHBOARD: '/admin/dashboard',
   WORKER_DASHBOARD: '/worker/dashboard',
   CUSTOMER_DASHBOARD: '/customer/profile',
} as const;

const USER_ROLES = {
   ADMIN: 'admin',
   WORKER: 'worker',
   CUSTOMER: 'customer',
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

interface RouteConfig {
   prefix: string;
   allowedRoles: UserRole[];
   requiresAuth: boolean;
   redirectOnUnauthorized: string;
}

/**
 * Route configurations - order matters (more specific first)
 * Each route defines:
 * - prefix: URL path prefix to match
 * - allowedRoles: Which roles can access this route
 * - requiresAuth: Whether authentication is required
 * - redirectOnUnauthorized: Where to redirect if user lacks permission
 */
const ROUTE_CONFIGS: RouteConfig[] = [
   {
      prefix: '/admin',
      allowedRoles: [USER_ROLES.ADMIN],
      requiresAuth: true,
      redirectOnUnauthorized: ROUTES.LOGIN,
   },
   {
      prefix: '/worker',
      allowedRoles: [USER_ROLES.WORKER],
      requiresAuth: true,
      redirectOnUnauthorized: ROUTES.LOGIN,
   },
   {
      prefix: '/customer',
      allowedRoles: [USER_ROLES.CUSTOMER],
      requiresAuth: true,
      redirectOnUnauthorized: ROUTES.LOGIN,
   },
   {
      prefix: '/orders',
      allowedRoles: [USER_ROLES.CUSTOMER],
      requiresAuth: true,
      redirectOnUnauthorized: ROUTES.LOGIN,
   },
   {
      prefix: '/profile',
      allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.WORKER, USER_ROLES.CUSTOMER],
      requiresAuth: true,
      redirectOnUnauthorized: ROUTES.LOGIN,
   },
];

const AUTH_ROUTES = ['/auth/login', '/auth/signup'] as const;

// ============================================
// Types
// ============================================

interface AuthToken {
   role?: string;
}

// ============================================
// Helpers
// ============================================

function isAuthenticated(token: AuthToken | null): boolean {
   return token !== null;
}

function isAuthRoute(pathname: string): boolean {
   return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function findMatchingRoute(pathname: string): RouteConfig | undefined {
   return ROUTE_CONFIGS.find((config) => pathname.startsWith(config.prefix));
}

function getRoleDashboard(role: UserRole): string {
   switch (role) {
      case USER_ROLES.ADMIN:
         return ROUTES.ADMIN_DASHBOARD;
      case USER_ROLES.WORKER:
         return ROUTES.WORKER_DASHBOARD;
      case USER_ROLES.CUSTOMER:
         return ROUTES.CUSTOMER_DASHBOARD;
      default:
         return ROUTES.HOME;
   }
}

function redirectTo(req: NextRequest, path: string): NextResponse {
   return NextResponse.redirect(new URL(path, req.url));
}

function getRoleFromToken(token: AuthToken | null): UserRole | null {
   if (!token?.role) return null;
   const role = token.role as UserRole;
   return Object.values(USER_ROLES).includes(role) ? role : null;
}

// ============================================
// Middleware
// ============================================

export async function middleware(req: NextRequest): Promise<NextResponse> {
   const token = (await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
   })) as AuthToken | null;

   const { pathname } = req.nextUrl;
   const userRole = getRoleFromToken(token);

   // 1. Handle auth routes - redirect logged-in users to their dashboard
   if (isAuthRoute(pathname)) {
      if (isAuthenticated(token) && userRole) {
         return redirectTo(req, getRoleDashboard(userRole));
      }
      return NextResponse.next();
   }

   // 2. Check if route requires specific permissions
   const matchedRoute = findMatchingRoute(pathname);

   if (matchedRoute) {
      // Not authenticated -> redirect to login
      if (matchedRoute.requiresAuth && !isAuthenticated(token)) {
         return redirectTo(req, matchedRoute.redirectOnUnauthorized);
      }

      // Authenticated but wrong role -> redirect to their dashboard
      if (userRole && !matchedRoute.allowedRoles.includes(userRole)) {
         return redirectTo(req, getRoleDashboard(userRole));
      }

      // All checks passed
      return NextResponse.next();
   }

   // 3. Handle cross-access restrictions for authenticated users on unmatched routes
   if (isAuthenticated(token) && userRole) {
      // Admin trying to access non-admin routes
      if (userRole === USER_ROLES.ADMIN) {
         return redirectTo(req, ROUTES.ADMIN_DASHBOARD);
      }

      // Worker trying to access non-worker routes
      if (userRole === USER_ROLES.WORKER) {
         return redirectTo(req, ROUTES.WORKER_DASHBOARD);
      }

      // Customers can access remaining public routes
   }

   // Allow all other requests
   return NextResponse.next();
}

// ============================================
// Config
// ============================================

export const config = {
   matcher: [
      '/admin/:path*',
      '/worker/:path*',
      '/customer/:path*',
      '/orders/:path*',
      '/auth/login',
      '/auth/signup',
      '/profile/:path*',
      '/',
   ],
};
