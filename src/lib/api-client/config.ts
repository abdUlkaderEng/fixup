/**
 * Axios Configuration Module
 *
 * Contains all configuration constants for the API client.
 * Centralizing config makes it easy to modify behavior without touching logic.
 */

/** Base URL for API requests - falls back to local dev server */
export const API_BASE_URL =
   process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/** Default axios instance configuration */
export const AXIOS_CONFIG = {
   headers: {
      'Content-Type': 'application/json',
   },
   timeout: 10000, // 10 seconds
   withCredentials: true,
} as const;

/** Error status codes that trigger redirects */
export const REDIRECT_STATUS_CODES = {
   UNAUTHORIZED: 401,
   SERVICE_UNAVAILABLE: 503,
} as const;

/** Route paths for error redirects */
export const ERROR_ROUTES = {
   LOGIN: '/auth/login',
   SERVER_ERROR: '/server-error',
} as const;

/** Network error codes that indicate server is down */
export const NETWORK_ERROR_CODES = [
   'ERR_NETWORK',
   'ECONNREFUSED',
   'ETIMEDOUT',
] as const;
