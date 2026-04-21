'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
   message?: string;
   className?: string;
   iconClassName?: string;
   size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
   sm: { icon: 'h-5 w-5', py: 'py-4' },
   md: { icon: 'h-8 w-8', py: 'py-8' },
   lg: { icon: 'h-12 w-12', py: 'py-12' },
};

export function LoadingState({
   message = 'Loading...',
   className,
   iconClassName,
   size = 'md',
}: LoadingStateProps) {
   const { icon, py } = sizeConfig[size];

   return (
      <div
         className={cn(
            'flex flex-col items-center justify-center text-muted-foreground',
            py,
            className
         )}
      >
         <Loader2
            className={cn(
               'animate-spin text-muted-foreground',
               icon,
               iconClassName
            )}
         />
         {message && <p className="text-sm mt-3">{message}</p>}
      </div>
   );
}
