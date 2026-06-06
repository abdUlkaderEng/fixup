'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountUpProps {
   /** Target value to animate towards. */
   value: number;
   /** Animation duration in milliseconds. */
   durationMs?: number;
   /** Rendered before the number (e.g. "+"). */
   prefix?: string;
   className?: string;
}

/**
 * Animates a number from 0 up to `value` with an ease-out curve using
 * `requestAnimationFrame`. Re-runs whenever `value` changes (e.g. when the real
 * data arrives), and respects `prefers-reduced-motion`.
 */
export function CountUp({
   value,
   durationMs = 1600,
   prefix,
   className,
}: CountUpProps) {
   const [display, setDisplay] = useState(0);
   const frameRef = useRef<number | null>(null);

   useEffect(() => {
      const cleanup = () => {
         if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      };

      const prefersReduced =
         typeof window !== 'undefined' &&
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // No motion needed — jump straight to the value. Done inside rAF (not the
      // effect body) to avoid a synchronous cascading render.
      if (value <= 0 || prefersReduced) {
         frameRef.current = requestAnimationFrame(() =>
            setDisplay(value <= 0 ? 0 : value)
         );
         return cleanup;
      }

      const start = performance.now();

      const tick = (now: number) => {
         const progress = Math.min((now - start) / durationMs, 1);
         // easeOutCubic — fast then settling, the classic count-up feel.
         const eased = 1 - Math.pow(1 - progress, 3);
         setDisplay(Math.round(value * eased));
         if (progress < 1) {
            frameRef.current = requestAnimationFrame(tick);
         }
      };

      frameRef.current = requestAnimationFrame(tick);

      return cleanup;
   }, [value, durationMs]);

   return (
      <span className={cn('tabular-nums', className)}>
         {prefix}
         {display.toLocaleString('en-US')}
      </span>
   );
}

export default CountUp;
