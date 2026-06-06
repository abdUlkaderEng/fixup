'use client';

import { Star } from 'lucide-react';
import { useWorkerRating } from '@/hooks';

interface WorkerRatingProps {
   /** Worker whose aggregate rating should be shown (offer.worker_id). */
   workerId: number;
}

/**
 * Compact worker rating shown alongside an offer's price: the average rating
 * with a star and the total number of ratings. Stays quiet while loading and
 * falls back to a "no ratings yet" hint when the worker has none.
 */
export function WorkerRating({ workerId }: WorkerRatingProps) {
   const { rating, isLoading } = useWorkerRating(workerId);

   if (isLoading) {
      return (
         <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 animate-pulse fill-amber-400 text-amber-400" />
         </span>
      );
   }

   const ratingsCount = Number(rating?.ratings_count) || 0;
   const averageRating = Number(rating?.average_rating) || 0;

   if (!rating || ratingsCount === 0) {
      return (
         <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-muted-foreground/30 text-muted-foreground/40" />
            لا توجد تقييمات بعد
         </span>
      );
   }

   return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
         <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
         {averageRating.toFixed(1)}
         <span className="text-muted-foreground">({ratingsCount} تقييم)</span>
      </span>
   );
}

export default WorkerRating;
