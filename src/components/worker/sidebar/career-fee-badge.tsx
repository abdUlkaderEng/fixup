'use client';

import { cn } from '@/lib/utils';
import { useCareerFee } from '@/hooks/worker';

export function CareerFeeBadge({ className }: { className?: string }) {
   const { fee } = useCareerFee();
   if (fee == null) return null;

   return (
      <div className={cn('mt-1 flex items-center', className)}>
         <div className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">
            <span className="text-[11px] font-semibold text-primary">
               رسوم المهنة
            </span>
            <span className="ml-1 text-[13px] font-bold">{fee}ل.س</span>
         </div>
      </div>
   );
}

export default CareerFeeBadge;
