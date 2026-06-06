'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { CustomerMobileNav } from './customer-mobile-nav';

/**
 * Conditional Navbar Component
 * Hides the customer chrome (top navbar + mobile bottom nav) for the
 * admin/worker dashboards, which provide their own navigation.
 */
export function ConditionalNavbar() {
   const pathname = usePathname();
   const isAdminRoute = pathname?.startsWith('/admin');
   const isWorkerRoute = pathname?.startsWith('/worker');

   if (isAdminRoute || isWorkerRoute) {
      return null;
   }

   return (
      <>
         <Navbar />
         <CustomerMobileNav />
      </>
   );
}
