'use client';

import { useEffect, useState } from 'react';
import { getHomepageStatistics } from '@/api/public';
import type { HomepageStatistics } from '@/types/public/statistics';

export interface UseHomepageStatisticsReturn {
   /** Aggregate counters, or `null` until the first fetch resolves. */
   statistics: HomepageStatistics | null;
   isLoading: boolean;
   error: Error | null;
}

/**
 * Module-level cache so the homepage counters are fetched once per session
 * rather than on every mount/remount of the hero.
 */
let statisticsCache: HomepageStatistics | null = null;

/**
 * Fetch the public homepage statistics (total customers + workers).
 *
 * Supplementary, non-critical data, so a failure resolves quietly to `error`
 * (no toast) and the UI simply falls back to zeros.
 */
export function useHomepageStatistics(): UseHomepageStatisticsReturn {
   const [fetched, setFetched] = useState<HomepageStatistics | null>(
      statisticsCache
   );
   const [isLoading, setIsLoading] = useState(!statisticsCache);
   const [error, setError] = useState<Error | null>(null);

   const statistics = statisticsCache ?? fetched;

   useEffect(() => {
      if (statisticsCache) return;

      let active = true;

      const load = async () => {
         setIsLoading(true);
         setError(null);
         try {
            const result = await getHomepageStatistics();
            if (!active) return;
            statisticsCache = result;
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
   }, []);

   return { statistics, isLoading, error };
}

export default useHomepageStatistics;
