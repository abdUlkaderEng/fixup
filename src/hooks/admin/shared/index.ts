// ============================================
// Admin Hooks - Shared Utilities
// ============================================
// Reusable hooks for data fetching, mutations, and pagination
// used across all admin domain hooks.

export {
   useFetch,
   generateRequestKey,
   isRequestPending,
   markRequestPending,
   markRequestComplete,
} from './use-fetch';

export type { UseFetchOptions, UseFetchReturn } from './use-fetch';

export { useMutation } from './use-mutation';
export type { UseMutationOptions, UseMutationReturn } from './use-mutation';

export { usePagination } from './use-pagination';
export type {
   PaginationState,
   UsePaginationOptions,
   UsePaginationReturn,
} from './use-pagination';
