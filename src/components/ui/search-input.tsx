'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   className?: string;
   inputClassName?: string;
   iconClassName?: string;
   showClearButton?: boolean;
   autoFocus?: boolean;
   disabled?: boolean;
}

export function SearchInput({
   value,
   onChange,
   placeholder = 'Search...',
   className,
   inputClassName,
   iconClassName,
   showClearButton = true,
   autoFocus = false,
   disabled = false,
}: SearchInputProps) {
   const handleClear = () => {
      onChange('');
   };

   return (
      <div className={cn('relative', className)}>
         <Search
            className={cn(
               'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
               iconClassName
            )}
         />
         <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            className={cn(
               'pl-10 pr-8 bg-background border-input',
               'focus-visible:ring-ring focus-visible:ring-1',
               inputClassName
            )}
         />
         {showClearButton && value && (
            <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={handleClear}
               className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
            >
               <X className="h-3 w-3 text-muted-foreground" />
            </Button>
         )}
      </div>
   );
}
