'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
   /** Currently selected value (1–max). 0 means none selected. */
   value?: number;
   /** Number of stars to render. */
   max?: number;
   /** Fired with the star value (1–max) when a star is clicked. */
   onChange?: (value: number) => void;
   /** Disable interaction (e.g. while submitting). */
   disabled?: boolean;
   /** Pixel size of each star. */
   size?: number;
   className?: string;
}

/**
 * Interactive star rating control. Hovering previews the value and clicking a
 * star commits it via `onChange`. Forced LTR so the stars read 1→max from the
 * left regardless of the surrounding RTL layout.
 */
export function StarRating({
   value = 0,
   max = 5,
   onChange,
   disabled = false,
   size = 32,
   className,
}: StarRatingProps) {
   const [hovered, setHovered] = useState(0);
   const active = hovered || value;

   return (
      <div
         dir="ltr"
         className={cn('flex items-center gap-1', className)}
         onMouseLeave={() => setHovered(0)}
      >
         {Array.from({ length: max }, (_, index) => {
            const starValue = index + 1;
            const filled = starValue <= active;

            return (
               <button
                  key={starValue}
                  type="button"
                  disabled={disabled}
                  aria-label={`${starValue} من ${max}`}
                  onMouseEnter={() => !disabled && setHovered(starValue)}
                  onClick={() => !disabled && onChange?.(starValue)}
                  className={cn(
                     'rounded-md p-0.5 transition-transform',
                     disabled
                        ? 'cursor-not-allowed opacity-70'
                        : 'cursor-pointer hover:scale-110'
                  )}
               >
                  <Star
                     style={{ width: size, height: size }}
                     className={cn(
                        'transition-colors',
                        filled
                           ? 'fill-amber-400 text-amber-400'
                           : 'fill-transparent text-muted-foreground/40'
                     )}
                  />
               </button>
            );
         })}
      </div>
   );
}

export default StarRating;
