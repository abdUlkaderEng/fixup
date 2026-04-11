/**
 * Axios Module Entry Point
 *
 * Centralized exports for the axios client module.
 * Import from here for cleaner import paths.
 */

// Main client export
export { apiClient, setAuthToken, default } from './client';

// Type exports
export type { ApiClientInterface } from './types';
export { isNetworkError, hasResponse } from './types';

// Error handling exports
export {
   handleAxiosError,
   handleUnauthorized,
   handleServerError,
   shouldRedirect,
} from './errors';

// Utility exports
export { isBrowser, safeRedirect, getCurrentPathname } from './utils';

// Config exports (useful for testing)
export { API_BASE_URL, AXIOS_CONFIG } from './config';
