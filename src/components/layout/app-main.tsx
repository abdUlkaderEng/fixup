'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useShowCustomerMobileNav } from '@/hooks/use-customer-mobile-nav';

/**
 * Root `<main>` wrapper. When the customer mobile bottom nav is active it
 * reserves matching bottom padding so page content (and bottom CTAs such as the
 * "review order" button) are never hidden behind the fixed bar. No effect on
 * `md+` or on the admin/worker dashboards.
 */
export function AppMain({ children }: { children: ReactNode }) {
   const showMobileNav = useShowCustomerMobileNav();

   return (
      <main
         className={cn(
            'flex-1',
            showMobileNav &&
               'pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0'
         )}
      >
         {children}
      </main>
   );
}
