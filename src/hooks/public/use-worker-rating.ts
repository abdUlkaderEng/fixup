'use client';

import { useEffect, useState } from 'react';
import { getWorkerRating } from '@/api/public';
import type { WorkerRating } from '@/types/entities/worker';

export interface UseWorkerRatingReturn {
   rating: WorkerRating | null;
   isLoading: boolean;
   error: Error | null;
}

/**
 * Module-level cache so the same worker's rating isn't re-fetched for every
 * offer row or re-render within a session.
 */
const ratingCache = new Map<number, WorkerRating>();

/**
 * Fetch a worker's aggregate rating by id.
 *
 * Supplementary, non-critical data (shown next to offer prices), so failures
 * resolve quietly to `error` without a toast — the UI just hides the rating.
 */
export function useWorkerRating(
   workerId: number | null | undefined
): UseWorkerRatingReturn {
   const [fetched, setFetched] = useState<WorkerRating | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   // Prefer the cached value during render so we never copy it via setState.
   const cached = workerId != null ? (ratingCache.get(workerId) ?? null) : null;
   const rating = cached ?? fetched;

   useEffect(() => {
      // Nothing to do without an id or when the rating is already cached.
      if (workerId == null || ratingCache.has(workerId)) return;

      let active = true;

      const load = async () => {
         setIsLoading(true);
         setError(null);
         try {
            const result = await getWorkerRating(workerId);
            if (!active) return;
            ratingCache.set(workerId, result);
            setFetched(result);
         } catch (err) {
            if (!active) return;
            setError(err instanceof Error ? err : new Error(String(err)));
         } finally {
            if (active) setIsLoading(false);
         }
      };

      void load();

      return () => {
         active = false;
      };
   }, [workerId]);

   return { rating, isLoading, error };
}

export default useWorkerRating;
