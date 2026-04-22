/**
 * Hooks - Main Entry Point
 * All application hooks exported from here
 */

// ============================================
// Public Data Hooks (Unauthenticated)
// ============================================
export {
   usePublicServices,
   type UsePublicServicesOptions,
   type UsePublicServicesReturn,
} from './public/use-public-services';
export {
   usePublicCareers,
   type UsePublicCareersOptions,
   type UsePublicCareersReturn,
} from './public/use-public-careers';
export {
   usePublicAreas,
   type UsePublicAreasOptions,
   type UsePublicAreasReturn,
} from './public/use-public-areas';

// ============================================
// Auth Hooks
// ============================================
export { useAuthToken } from './use-auth-token';
export { useLogout } from './use-logout';

// ============================================
// Profile & Worker Hooks
// ============================================
export { useProfileForm } from './use-profile-form';
export { useProfileSubmit } from './use-profile-submit';
export { useWorkerRegister } from './use-worker-register';

// ============================================
// Search Hooks
// ============================================
export { usePhotonSearch } from './use-photon-search';

// ============================================
// Admin Hooks (re-exported)
// ============================================
export * from './admin';
