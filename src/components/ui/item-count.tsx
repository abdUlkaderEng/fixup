'use client';

import { cn } from '@/lib/utils';

interface ItemCountProps {
   count: number;
   label: string;
   isLoading?: boolean;
   className?: string;
}

export function ItemCount({
   count,
   label,
   isLoading = false,
   className,
}: ItemCountProps) {
   return (
      <div className={cn('text-sm admin-text-muted', className)}>
         <span className="font-semibold admin-text">
            {isLoading ? '...' : count}
         </span>{' '}
         {label}
      </div>
   );
}
