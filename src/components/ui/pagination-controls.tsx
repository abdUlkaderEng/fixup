'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PaginationControlsProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   /** Show first/prev/next/last buttons (default true). */
   showArrows?: boolean;
   /** Disable all controls (e.g. while loading). */
   disabled?: boolean;
   /** Max numbered pages to render (default 5). */
   maxVisible?: number;
   className?: string;
}

/**
 * Compact numbered pagination with ellipsis around the current page.
 *
 * RTL-aware: chevrons flip to keep "previous" on the right (start) in Arabic.
 * Renders nothing when totalPages <= 1.
 */
export function PaginationControls({
   currentPage,
   totalPages,
   onPageChange,
   showArrows = true,
   disabled = false,
   maxVisible = 5,
   className,
}: PaginationControlsProps) {
   const pages = useMemo(
      () => buildPageList(currentPage, totalPages, maxVisible),
      [currentPage, totalPages, maxVisible]
   );

   if (totalPages <= 1) return null;

   const canPrev = !disabled && currentPage > 1;
   const canNext = !disabled && currentPage < totalPages;

   return (
      <nav
         dir="rtl"
         aria-label="ترقيم الصفحات"
         className={cn(
            'flex items-center justify-center gap-1.5 select-none',
            className
         )}
      >
         {showArrows && (
            <Button
               type="button"
               variant="outline"
               size="icon"
               className="h-9 w-9"
               onClick={() => onPageChange(currentPage - 1)}
               disabled={!canPrev}
               aria-label="الصفحة السابقة"
            >
               <ChevronRight className="h-4 w-4" />
            </Button>
         )}

         {pages.map((page, idx) =>
            page === 'ellipsis' ? (
               <span
                  key={`gap-${idx}`}
                  className="px-2 text-sm text-muted-foreground"
                  aria-hidden="true"
               >
                  …
               </span>
            ) : (
               <Button
                  key={page}
                  type="button"
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className={cn(
                     'h-9 min-w-9 px-2 text-sm font-medium',
                     page === currentPage && 'pointer-events-none'
                  )}
                  onClick={() => onPageChange(page)}
                  disabled={disabled}
                  aria-current={page === currentPage ? 'page' : undefined}
               >
                  {page}
               </Button>
            )
         )}

         {showArrows && (
            <Button
               type="button"
               variant="outline"
               size="icon"
               className="h-9 w-9"
               onClick={() => onPageChange(currentPage + 1)}
               disabled={!canNext}
               aria-label="الصفحة التالية"
            >
               <ChevronLeft className="h-4 w-4" />
            </Button>
         )}
      </nav>
   );
}

/**
 * Build a windowed page list with ellipses around the current page.
 *
 * Example for totalPages=10, currentPage=5, maxVisible=5:
 *   [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
function buildPageList(
   current: number,
   total: number,
   maxVisible: number
): Array<number | 'ellipsis'> {
   if (total <= maxVisible + 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
   }

   const half = Math.floor(maxVisible / 2);
   let start = Math.max(2, current - half);
   let end = Math.min(total - 1, current + half);

   if (current - 1 <= half) {
      end = maxVisible;
   }
   if (total - current <= half) {
      start = total - maxVisible + 1;
   }

   const pages: Array<number | 'ellipsis'> = [1];
   if (start > 2) pages.push('ellipsis');
   for (let p = start; p <= end; p++) pages.push(p);
   if (end < total - 1) pages.push('ellipsis');
   pages.push(total);

   return pages;
}
