'use client';

import { useCallback } from 'react';
import { publicCareersApi } from '@/api/public/careers';
import type { PublicCareer } from '@/types/public/careers';
import { usePublicResource } from './shared';

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
   const fetcher = useCallback(() => publicCareersApi.getAll(), []);

   const result = usePublicResource({ resource: 'careers', fetcher }, options);

   return {
      careers: result.rows,
      isLoading: result.isLoading,
      error: result.error,
      refresh: result.refresh,
      refetch: result.refetch,
   };
}
