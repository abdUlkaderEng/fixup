'use client';

import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarLogo } from './sidebar-logo';

interface SidebarHeaderProps {
   /** When true, shows logo + collapse/close button. When false, shows only the expand button. */
   expanded: boolean;
   onToggle: () => void;
   /** Renders an X close button instead of the collapse chevron (mobile drawer). */
   showCloseButton?: boolean;
}

const iconButtonClass =
   'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

export function SidebarHeader({
   expanded,
   onToggle,
   showCloseButton = false,
}: SidebarHeaderProps) {
   return (
      <div
         className={cn(
            'flex h-16 shrink-0 items-center border-b border-border/60',
            expanded ? 'px-3' : 'justify-center px-0'
         )}
      >
         {expanded ? (
            <>
               <SidebarLogo onClick={showCloseButton ? onToggle : undefined} />
               <button
                  type="button"
                  onClick={onToggle}
                  aria-label={showCloseButton ? 'إغلاق القائمة' : 'طي القائمة'}
                  className={cn(iconButtonClass, 'mr-2')}
               >
                  {showCloseButton ? (
                     <X className="h-5 w-5" />
                  ) : (
                     <ChevronRight className="h-4 w-4" />
                  )}
               </button>
            </>
         ) : (
            <button
               type="button"
               onClick={onToggle}
               aria-label="توسيع القائمة"
               className={iconButtonClass}
            >
               <Menu className="h-4 w-4" />
            </button>
         )}
      </div>
   );
}
