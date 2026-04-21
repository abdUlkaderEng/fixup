// ============================================
// Admin API Module - Main Entry Point
// ============================================
// This module provides a clean, domain-separated API layer
// for admin operations with shared utilities.
//
// Usage:
//   import { careersApi, servicesApi } from '@/api/admin';
//   or
//   import { adminApi } from '@/api/admin'; // Legacy compatibility
//
// Legacy import (backward compatible):
//   import { adminApi } from '@/api/admin';

import { workersApi } from './workers';
import type {
   UpdateWorkerRequest,
   UpdateWorkerResponse,
   DeleteWorkerResponse,
} from './workers';
import { servicesApi } from './services';
import { careersApi } from './careers';
import { addressesApi } from './addresses';
import {
   AdminApiError,
   handleApiError,
   buildQueryString,
   buildWorkerQuery,
   buildServiceQuery,
   PaginationParams,
   WorkerFilters,
   ServiceFilters,
   get,
   post,
   put,
   del,
   ENDPOINTS,
} from './shared';

// ============================================
// Re-exports for individual domain access
// ============================================

export { workersApi, servicesApi, careersApi, addressesApi };

// ============================================
// Shared utilities export
// ============================================

export {
   // Error handling
   AdminApiError,
   handleApiError,

   // Query builders
   buildQueryString,
   buildWorkerQuery,
   buildServiceQuery,

   // HTTP helpers
   get,
   post,
   put,
   del,

   // Constants
   ENDPOINTS,
};

export type {
   // Types
   PaginationParams,
   WorkerFilters,
   ServiceFilters,
};

// ============================================
// Legacy aggregate API (backward compatible)
// ============================================
// Maps old adminApi structure to new modular structure

/**
 * @deprecated Use individual domain APIs (careersApi, servicesApi, etc.)
 * This aggregate object is kept for backward compatibility.
 */
export const adminApi = {
   // Workers
   getWorkers: workersApi.getAll,
   getPendingWorkers: workersApi.getPending,
   updateWorker: workersApi.update,
   deleteWorker: workersApi.delete,

   // Services
   getServices: servicesApi.getAll,
   createService: servicesApi.create,
   updateService: servicesApi.update,
   deleteService: servicesApi.delete,

   // Careers
   getCareers: careersApi.getAll,
   getCareersList: careersApi.getList,
   createCareer: careersApi.create,
   deleteCareer: careersApi.delete,

   // Addresses
   getAddresses: addressesApi.getAll,
   createAddress: addressesApi.create,
   deleteAddress: addressesApi.delete,
};

// ============================================
// Type exports for consumers
// ============================================

export type { UpdateWorkerRequest, UpdateWorkerResponse, DeleteWorkerResponse };

// Default export for convenience
export default adminApi;
