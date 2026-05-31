'use client';

import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have passed without a change. Useful for search inputs so we
 * don't fire a request on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 350): T {
   const [debounced, setDebounced] = useState<T>(value);

   useEffect(() => {
      const handle = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handle);
   }, [value, delay]);

   return debounced;
}

export default useDebouncedValue;
