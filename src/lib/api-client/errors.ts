/**
 * Axios Error Handling Module
 *
 * Centralized error handling with SSR-safe redirects.
 * Extracting error logic makes it testable and reusable.
 */

import type { AxiosError } from 'axios';
import { REDIRECT_STATUS_CODES, ERROR_ROUTES } from './config';
import { safeRedirect, isCurrentPath } from './utils';
import { isNetworkError } from './types';

/**
 * Handle 401 Unauthorized errors
 * Redirects to login page when user token is invalid/expired
 */
export const handleUnauthorized = (): void => {
   safeRedirect(ERROR_ROUTES.LOGIN);
};

/**
 * Handle server/network errors (503, connection refused, etc.)
 * Redirects to server error page but prevents redirect loops
 */
export const handleServerError = (): void => {
   // Prevent infinite redirect loops
   if (isCurrentPath(ERROR_ROUTES.SERVER_ERROR)) return;
   safeRedirect(ERROR_ROUTES.SERVER_ERROR);
};

/**
 * Main error handler - dispatches to appropriate handler based on error type
 * @param error - Axios error object
 */
export const handleAxiosError = (error: AxiosError): void => {
   // Handle network errors (no response from server)
   if (isNetworkError(error)) {
      handleServerError();
      return;
   }

   const status = error.response?.status;

   switch (status) {
      case REDIRECT_STATUS_CODES.UNAUTHORIZED:
         handleUnauthorized();
         break;
      case REDIRECT_STATUS_CODES.SERVICE_UNAVAILABLE:
         handleServerError();
         break;
      // Add more cases as needed (403, 404, 500, etc.)
      default:
         // No redirect for other errors - let caller handle
         break;
   }
};

/**
 * Check if error should trigger a redirect
 * Useful for preventing unnecessary error processing
 */
export const shouldRedirect = (error: AxiosError): boolean => {
   if (isNetworkError(error)) return true;
   const status = error.response?.status;
   return (
      status === REDIRECT_STATUS_CODES.UNAUTHORIZED ||
      status === REDIRECT_STATUS_CODES.SERVICE_UNAVAILABLE
   );
};
