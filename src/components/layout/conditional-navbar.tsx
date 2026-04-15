'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

/**
 * Conditional Navbar Component
 * Hides navbar for admin routes
 */
export function ConditionalNavbar() {
   const pathname = usePathname();
   const isAdminRoute = pathname?.startsWith('/admin');

   if (isAdminRoute) {
      return null;
   }

   return <Navbar />;
}
