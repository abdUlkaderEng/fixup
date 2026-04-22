'use client';

import { cn } from '@/lib/utils';

export interface RadioCardOption {
   value: string;
   title: string;
   description?: string;
}

interface RadioCardGroupProps {
   name: string;
   value: string;
   options: readonly RadioCardOption[];
   onChange: (value: string) => void;
   className?: string;
}

export function RadioCardGroup({
   name,
   value,
   options,
   onChange,
   className,
}: RadioCardGroupProps) {
   return (
      <div
         role="radiogroup"
         aria-label={name}
         className={cn('grid grid-cols-1 gap-3', className)}
      >
         {options.map((option) => {
            const isActive = value === option.value;

            return (
               <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => onChange(option.value)}
                  className={cn(
                     'app-choice-card text-right',
                     'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                     isActive
                        ? 'app-choice-card-active'
                        : 'app-choice-card-idle'
                  )}
               >
                  <input
                     type="radio"
                     name={name}
                     value={option.value}
                     checked={isActive}
                     onChange={() => onChange(option.value)}
                     className="sr-only"
                     tabIndex={-1}
                  />
                  <p className="text-sm font-semibold">{option.title}</p>
                  {option.description ? (
                     <p className="text-xs text-muted-foreground">
                        {option.description}
                     </p>
                  ) : null}
               </button>
            );
         })}
      </div>
   );
}

export default RadioCardGroup;
