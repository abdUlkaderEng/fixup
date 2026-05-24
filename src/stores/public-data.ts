'use client';

import { create } from 'zustand';
import type { Service } from '@/types/admin/services';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';

/**
 * Public Data Store
 *
 * Centralized cache for unauthenticated reference data (services, careers,
 * areas). Each resource has either a paginated cache (keyed by query params)
 * or a single-list cache, plus shared loading/error flags. Cross-component
 * cache means a careers list fetched on the landing page is reused by the
 * profile dropdown without a second request.
 */

// ============================================
// Resource registry
// ============================================
// To add a new public resource, extend ONE of these enums and add its row
// type. The store + hooks pick it up automatically.

export type PaginatedResource = 'services' | 'areas';
export type SingleResource = 'careers';

export interface PaginatedRowMap {
   services: Service;
   areas: PublicArea;
}

export interface SingleRowMap {
   careers: PublicCareer;
}

// ============================================
// Cache entry shapes
// ============================================

export interface PaginatedCacheEntry<TRow> {
   rows: TRow[];
   currentPage: number;
   lastPage: number;
   total: number;
   perPage: number;
   fetchedAt: number;
}

export interface SingleCacheEntry<TRow> {
   rows: TRow[];
   fetchedAt: number;
}

type PaginatedCache<R extends PaginatedResource> = Record<
   string,
   PaginatedCacheEntry<PaginatedRowMap[R]>
>;

type AnyResource = PaginatedResource | SingleResource;

// ============================================
// Cache TTL & validity
// ============================================

const CACHE_TTL_MS = 5 * 60 * 1000;

export function isCacheValid<T extends { fetchedAt: number }>(
   entry: T | undefined
): boolean {
   if (!entry) return false;
   return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

// ============================================
// Cache key generation
// ============================================

/**
 * Stable key for paginated resource caches. Pass any filters that affect the
 * query (e.g., career_id for services).
 */
export function generatePublicCacheKey(
   filters: Record<string, string | number | undefined | null>
): string {
   return Object.entries(filters)
      .map(([k, v]) => `${k}:${v ?? 'all'}`)
      .join('|');
}

// ============================================
// Store state
// ============================================

interface PublicDataState {
   paginated: {
      [R in PaginatedResource]: PaginatedCache<R>;
   };
   single: {
      [R in SingleResource]: SingleCacheEntry<SingleRowMap[R]> | undefined;
   };

   loading: Record<AnyResource, boolean>;
   errors: Record<AnyResource, Error | null>;

   // Paginated actions
   setPaginatedEntry: <R extends PaginatedResource>(
      resource: R,
      cacheKey: string,
      entry: Omit<PaginatedCacheEntry<PaginatedRowMap[R]>, 'fetchedAt'>
   ) => void;
   getPaginatedEntry: <R extends PaginatedResource>(
      resource: R,
      cacheKey: string
   ) => PaginatedCacheEntry<PaginatedRowMap[R]> | undefined;
   clearPaginated: (resource: PaginatedResource) => void;

   // Single actions
   setSingleEntry: <R extends SingleResource>(
      resource: R,
      entry: Omit<SingleCacheEntry<SingleRowMap[R]>, 'fetchedAt'>
   ) => void;
   getSingleEntry: <R extends SingleResource>(
      resource: R
   ) => SingleCacheEntry<SingleRowMap[R]> | undefined;
   clearSingle: (resource: SingleResource) => void;

   // Loading / error
   setLoading: (resource: AnyResource, loading: boolean) => void;
   setError: (resource: AnyResource, error: Error | null) => void;
}

// ============================================
// Store
// ============================================

export const usePublicDataStore = create<PublicDataState>((set, get) => ({
   paginated: { services: {}, areas: {} },
   single: { careers: undefined },

   loading: { services: false, careers: false, areas: false },
   errors: { services: null, careers: null, areas: null },

   setPaginatedEntry: (resource, cacheKey, entry) => {
      set((state) => ({
         paginated: {
            ...state.paginated,
            [resource]: {
               ...state.paginated[resource],
               [cacheKey]: { ...entry, fetchedAt: Date.now() },
            },
         },
      }));
   },

   getPaginatedEntry: (resource, cacheKey) =>
      get().paginated[resource][cacheKey],

   clearPaginated: (resource) => {
      set((state) => ({
         paginated: { ...state.paginated, [resource]: {} },
      }));
   },

   setSingleEntry: (resource, entry) => {
      set((state) => ({
         single: {
            ...state.single,
            [resource]: { ...entry, fetchedAt: Date.now() },
         },
      }));
   },

   getSingleEntry: (resource) => get().single[resource],

   clearSingle: (resource) => {
      set((state) => ({ single: { ...state.single, [resource]: undefined } }));
   },

   setLoading: (resource, loading) => {
      set((state) => ({ loading: { ...state.loading, [resource]: loading } }));
   },

   setError: (resource, error) => {
      set((state) => ({ errors: { ...state.errors, [resource]: error } }));
   },
}));

export default usePublicDataStore;
