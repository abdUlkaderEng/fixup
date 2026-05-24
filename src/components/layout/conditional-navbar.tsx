'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

/**
 * Conditional Navbar Component
 * Hides navbar for admin routes
 */
export function ConditionalNavbar() {
   const pathname = usePathname();
   const isAdminRoute = pathname?.startsWith('/admin');
   const isWorkerRoute = pathname?.startsWith('/worker');

   if (isAdminRoute || isWorkerRoute) {
      return null;
   }

   return <Navbar />;
}
