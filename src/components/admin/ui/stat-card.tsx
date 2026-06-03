'use client';

import { formatNumber } from '@/lib/format';
import type { StatCardProps } from '@/types/admin';

/**
 * Statistic card component
 * Displays a single dashboard metric with a subtle brand-tinted icon tile.
 */
export function StatCard({ title, value, icon: Icon }: StatCardProps) {
   const displayValue = typeof value === 'number' ? formatNumber(value) : value;

   return (
      <div className="group h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#13377b]/20 hover:shadow-md">
         <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
               <p className="truncate text-sm font-medium admin-text-muted">
                  {title}
               </p>
               <p className="mt-2 text-3xl font-bold tracking-tight admin-text tabular-nums">
                  {displayValue}
               </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center  rounded-xl bg-[#13377b]/10 text-[#13377b] transition-colors duration-200 group-hover:bg-[#13377b]/15">
               <Icon className="h-5 w-5 " />
            </div>
         </div>
      </div>
   );
}

/**
 * Loading placeholder matching the StatCard shape.
 */
export function StatCardSkeleton() {
   return (
      <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
               <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-gray-200" />
               <div className="h-8 w-1/2 animate-pulse rounded-lg bg-gray-200" />
            </div>
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-gray-200" />
         </div>
      </div>
   );
}
