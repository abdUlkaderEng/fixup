'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
   icon?: ReactNode;
   title: string;
   description?: string;
   action?: ReactNode;
   className?: string;
   iconClassName?: string;
   titleClassName?: string;
   descriptionClassName?: string;
}

export function EmptyState({
   icon,
   title,
   description,
   action,
   className,
   iconClassName,
   titleClassName,
   descriptionClassName,
}: EmptyStateProps) {
   return (
      <div
         className={cn(
            'flex flex-col items-center justify-center py-12 px-4 text-center',
            className
         )}
      >
         {icon && (
            <div className={cn('text-muted-foreground/50 mb-4', iconClassName)}>
               {icon}
            </div>
         )}
         <h3
            className={cn(
               'text-base font-medium text-foreground',
               titleClassName
            )}
         >
            {title}
         </h3>
         {description && (
            <p
               className={cn(
                  'text-sm text-muted-foreground mt-1 max-w-sm',
                  descriptionClassName
               )}
            >
               {description}
            </p>
         )}
         {action && <div className="mt-4">{action}</div>}
      </div>
   );
}
