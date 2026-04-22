'use client';

import { create } from 'zustand';
import type { Service } from '@/types/admin/services';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';

/**
 * Public Data Store
 * Centralized cache for public reference data (services, careers, areas)
 * Prevents duplicate API calls across components
 */

// ============================================
// Cache Entry Types
// ============================================

interface ServiceCacheEntry {
   services: Service[];
   currentPage: number;
   lastPage: number;
   total: number;
   perPage: number;
   fetchedAt: number;
}

interface CareerCacheEntry {
   careers: PublicCareer[];
   fetchedAt: number;
}

interface AreaCacheEntry {
   areas: PublicArea[];
   currentPage: number;
   lastPage: number;
   total: number;
   perPage: number;
   fetchedAt: number;
}

interface ServiceCache {
   [cacheKey: string]: ServiceCacheEntry;
}

interface AreaCache {
   [cacheKey: string]: AreaCacheEntry;
}

// ============================================
// Store State Interface
// ============================================

interface PublicDataState {
   // Service cache keyed by "careerId:page:perPage"
   serviceCache: ServiceCache;
   // Career cache (no pagination - single list)
   careerCache: CareerCacheEntry | undefined;
   // Area cache keyed by "page:perPage"
   areaCache: AreaCache;

   // Global loading states
   isLoadingServices: boolean;
   isLoadingCareers: boolean;
   isLoadingAreas: boolean;

   // Error states
   servicesError: Error | null;
   careersError: Error | null;
   areasError: Error | null;

   // Actions - Services
   setServiceCache: (
      cacheKey: string,
      entry: Omit<ServiceCacheEntry, 'fetchedAt'>
   ) => void;
   getServiceCache: (cacheKey: string) => ServiceCacheEntry | undefined;
   setServicesLoading: (loading: boolean) => void;
   setServicesError: (error: Error | null) => void;
   clearServiceCache: () => void;

   // Actions - Careers
   setCareerCache: (entry: Omit<CareerCacheEntry, 'fetchedAt'>) => void;
   getCareerCache: () => CareerCacheEntry | undefined;
   setCareersLoading: (loading: boolean) => void;
   setCareersError: (error: Error | null) => void;
   clearCareerCache: () => void;

   // Actions - Areas
   setAreaCache: (
      cacheKey: string,
      entry: Omit<AreaCacheEntry, 'fetchedAt'>
   ) => void;
   getAreaCache: (cacheKey: string) => AreaCacheEntry | undefined;
   setAreasLoading: (loading: boolean) => void;
   setAreasError: (error: Error | null) => void;
   clearAreaCache: () => void;
}

// ============================================
// Cache Key Generators
// ============================================

export function generateServiceCacheKey(
   careerId: number | undefined,
   page: number,
   perPage: number
): string {
   return `${careerId ?? 'all'}:${page}:${perPage}`;
}

export function generateAreaCacheKey(page: number, perPage: number): string {
   return `${page}:${perPage}`;
}

// ============================================
// Cache TTL (5 minutes)
// ============================================

const CACHE_TTL_MS = 5 * 60 * 1000;

export function isCacheValid<T extends { fetchedAt: number }>(
   entry: T | undefined
): boolean {
   if (!entry) return false;
   return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

// ============================================
// Zustand Store
// ============================================

export const usePublicDataStore = create<PublicDataState>((set, get) => ({
   // ============================================
   // Initial state
   // ============================================
   serviceCache: {},
   careerCache: undefined,
   areaCache: {},

   isLoadingServices: false,
   isLoadingCareers: false,
   isLoadingAreas: false,

   servicesError: null,
   careersError: null,
   areasError: null,

   // ============================================
   // Service Actions
   // ============================================
   setServiceCache: (cacheKey, entry) => {
      set((state) => ({
         serviceCache: {
            ...state.serviceCache,
            [cacheKey]: {
               ...entry,
               fetchedAt: Date.now(),
            },
         },
      }));
   },

   getServiceCache: (cacheKey) => {
      return get().serviceCache[cacheKey];
   },

   setServicesLoading: (loading) => {
      set({ isLoadingServices: loading });
   },

   setServicesError: (error) => {
      set({ servicesError: error });
   },

   clearServiceCache: () => {
      set({ serviceCache: {} });
   },

   // ============================================
   // Career Actions
   // ============================================
   setCareerCache: (entry) => {
      set({
         careerCache: {
            ...entry,
            fetchedAt: Date.now(),
         },
      });
   },

   getCareerCache: () => {
      return get().careerCache;
   },

   setCareersLoading: (loading) => {
      set({ isLoadingCareers: loading });
   },

   setCareersError: (error) => {
      set({ careersError: error });
   },

   clearCareerCache: () => {
      set({ careerCache: undefined });
   },

   // ============================================
   // Area Actions
   // ============================================
   setAreaCache: (cacheKey, entry) => {
      set((state) => ({
         areaCache: {
            ...state.areaCache,
            [cacheKey]: {
               ...entry,
               fetchedAt: Date.now(),
            },
         },
      }));
   },

   getAreaCache: (cacheKey) => {
      return get().areaCache[cacheKey];
   },

   setAreasLoading: (loading) => {
      set({ isLoadingAreas: loading });
   },

   setAreasError: (error) => {
      set({ areasError: error });
   },

   clearAreaCache: () => {
      set({ areaCache: {} });
   },
}));

export default usePublicDataStore;
