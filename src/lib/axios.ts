// Re-export from modular axios structure
// See src/lib/axios/ for implementation details
export {
   apiClient,
   setAuthToken,
   default,
   // Error handlers
   handleAxiosError,
   handleUnauthorized,
   handleServerError,
   shouldRedirect,
   // Utilities
   isBrowser,
   safeRedirect,
   getCurrentPathname,
   // Types
   isNetworkError,
   hasResponse,
} from './api-client';

export type { ApiClientInterface } from './api-client';
