'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
   error?: boolean;
}

const FloatingLabelInput = React.forwardRef<
   HTMLInputElement,
   FloatingLabelInputProps
>(({ className, type, label, error, ...props }, ref) => {
   const [isFocused, setIsFocused] = React.useState(false);
   const [hasValue, setHasValue] = React.useState(false);

   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
   };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
   };

   const isFloating = isFocused || hasValue;

   return (
      <div className="relative">
         {/* Floating Label */}
         <label
            className={cn(
               'bg-transparent absolute right-6 transition-all duration-200 ease-out pointer-events-none',
               'text-muted-foreground',
               isFloating
                  ? '-top-2.5 text-xs right-0   px-1  font-medium'
                  : 'top-1/2 -translate-y-1/2 text-base'
            )}
         >
            {label}
         </label>

         {/* Input */}
         <input
            type={type}
            className={cn(
               // Base styles - transparent bg, only bottom border
               'w-full bg-transparent px-3 py-2.5  text-base outline-none transition-all duration-200',
               'border-0 border-b-2 rounded-none',
               // Border colors
               error
                  ? 'border-destructive focus:border-destructive'
                  : isFocused
                    ? 'border-primary shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)]'
                    : 'border-border hover:border-muted-foreground/50',
               // Dark mode
               'dark:focus:border-primary dark:shadow-[0_4px_12px_-6px_rgba(255,255,255,0.05)]',
               // Placeholder - only show when focused
               isFocused
                  ? 'placeholder:text-muted-foreground/50 placeholder:text-sm'
                  : 'placeholder:text-transparent',
               className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
         />

         {/* Bottom border highlight line */}
         <div
            className={cn(
               'absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out',
               isFocused && !error ? 'w-full' : 'w-0'
            )}
         />
      </div>
   );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingLabelInput };
