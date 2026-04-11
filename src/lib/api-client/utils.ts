/**
 * Axios Utilities Module
 *
 * Helper functions for browser/SSR detection and URL handling.
 */

/** Check if code is running in browser (not SSR) */
export const isBrowser = (): boolean => typeof window !== 'undefined';

/** Safely get current pathname (returns empty string on SSR) */
export const getCurrentPathname = (): string => {
   if (!isBrowser()) return '';
   return window.location.pathname;
};

/** Safely redirect to a path (only works in browser) */
export const safeRedirect = (path: string): void => {
   if (!isBrowser()) return;
   window.location.href = path;
};

/** Check if current path matches a pattern */
export const isCurrentPath = (pattern: string): boolean => {
   return getCurrentPathname().includes(pattern);
};
