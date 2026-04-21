// ============================================
// Admin Hooks - Main Entry Point
// ============================================
// Clean, reusable hooks for admin domain operations.
// Built on top of shared utilities for consistency.

// ============================================
// Shared Utilities (re-exported for convenience)
// ============================================
export {
   useFetch,
   useMutation,
   usePagination,
   generateRequestKey,
   isRequestPending,
   markRequestPending,
   markRequestComplete,
} from './shared';

export type {
   UseFetchOptions,
   UseFetchReturn,
   UseMutationOptions,
   UseMutationReturn,
   PaginationState,
   UsePaginationOptions,
   UsePaginationReturn,
} from './shared';

// ============================================
// Domain-Specific Hooks
// ============================================
export {
   useCareers,
   type UseCareersReturn,
   type UseCareersOptions,
} from './use-careers';
export {
   useCareerMutations,
   type CreateCareerResult,
   type UseCareerMutationsReturn,
} from './use-career-mutations';

export {
   useServices,
   type UseServicesReturn,
   type UseServicesOptions,
} from './use-services';
export {
   useServiceMutations,
   type CreateServiceResult,
   type UseServiceMutationsReturn,
} from './use-service-mutations';

export {
   useAddresses,
   type UseAddressesReturn,
   type UseAddressesOptions,
} from './use-addresses';

export {
   useWorkers,
   type UseWorkersReturn,
   type UseWorkersOptions,
} from './use-workers';
export {
   useWorkerMutations,
   type UseWorkerMutationsReturn,
} from './use-worker-mutations';
