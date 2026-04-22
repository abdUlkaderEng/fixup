'use client';

import { useCallback, useEffect, useState } from 'react';
import { publicCareersApi } from '@/api/public/careers';
import { usePublicDataStore, isCacheValid } from '@/stores/public-data';
import type { PublicCareer } from '@/types/public/careers';

// ============================================
// Types
// ============================================

export interface UsePublicCareersOptions {
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
   /** Skip cache and force refresh (default: false) */
   skipCache?: boolean;
}

export interface UsePublicCareersReturn {
   /** List of careers */
   careers: PublicCareer[];
   /** Loading state */
   isLoading: boolean;
   /** Error state */
   error: Error | null;
   /** Refresh data (bypasses cache) */
   refresh: () => Promise<void>;
   /** Refetch data */
   refetch: () => Promise<void>;
}

// ============================================
// Hook
// ============================================

export function usePublicCareers(
   options: UsePublicCareersOptions = {}
): UsePublicCareersReturn {
   const { autoFetch = true, skipCache = false } = options;

   // Local state for immediate UI updates
   const [localError, setLocalError] = useState<Error | null>(null);

   // Zustand store
   const store = usePublicDataStore();

   // Get cached data
   const cachedEntry = store.getCareerCache();
   const careers = cachedEntry?.careers ?? [];

   // ============================================
   // Fetch Function
   // ============================================

   const fetchCareers = useCallback(
      async (forceRefresh = false) => {
         // Check cache first
         const cached = store.getCareerCache();

         if (!forceRefresh && cached && isCacheValid(cached)) {
            return;
         }

         store.setCareersLoading(true);
         store.setCareersError(null);
         setLocalError(null);

         try {
            const response = await publicCareersApi.getAll();

            // Update cache
            store.setCareerCache({
               careers: response.data,
            });
         } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            store.setCareersError(error);
            setLocalError(error);
         } finally {
            store.setCareersLoading(false);
         }
      },
      [store]
   );

   // ============================================
   // Auto-fetch on mount
   // ============================================

   useEffect(() => {
      if (!autoFetch) return;
      fetchCareers(skipCache);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [autoFetch, skipCache]);

   // ============================================
   // Refresh handlers
   // ============================================

   const refresh = useCallback(async () => {
      await fetchCareers(true);
   }, [fetchCareers]);

   const refetch = useCallback(async () => {
      await fetchCareers(true);
   }, [fetchCareers]);

   // ============================================
   // Return
   // ============================================

   return {
      careers,
      isLoading: store.isLoadingCareers,
      error: localError ?? store.careersError,
      refresh,
      refetch,
   };
}

export default usePublicCareers;
