import { useState, useEffect, useRef } from 'react';
import { searchLocation } from '@/lib/geocoding';
import { SearchResult } from '@/types/map';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

interface UsePhotonSearchReturn {
   results: SearchResult[];
   isSearching: boolean;
   error: string | null;
}

export function usePhotonSearch(query: string): UsePhotonSearchReturn {
   const [results, setResults] = useState<SearchResult[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      if (query.trim().length < MIN_QUERY_LENGTH) {
         setResults([]);
         setError(null);
         return;
      }

      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }

      setIsSearching(true);
      setError(null);

      timeoutRef.current = setTimeout(async () => {
         try {
            const searchResults = await searchLocation(query);
            setResults(searchResults);
         } catch {
            setError('Failed to search location. Please try again.');
            setResults([]);
         } finally {
            setIsSearching(false);
         }
      }, DEBOUNCE_MS);

      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, [query]);

   return { results, isSearching, error };
}
