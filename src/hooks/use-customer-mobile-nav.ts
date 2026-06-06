'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Whether the customer mobile bottom navigation should be active for the
 * current route + session.
 *
 * Shared as a single source of truth by:
 * - `CustomerMobileNav` (renders the bar itself)
 * - `AppMain` (reserves bottom padding so content isn't hidden behind the bar)
 * - `FixChatbot` (lifts its launcher above the bar)
 *
 * It is `true` only for authenticated customers on customer-facing routes — the
 * bar is intentionally hidden on the admin/worker dashboards, which have their
 * own navigation chrome.
 */
export function useShowCustomerMobileNav(): boolean {
   const pathname = usePathname() ?? '';
   const { data: session, status } = useSession();
   const role = session?.user?.role;

   const isDashboardArea =
      pathname.startsWith('/admin') || pathname.startsWith('/worker');

   return (
      status === 'authenticated' &&
      role !== 'admin' &&
      role !== 'worker' &&
      !isDashboardArea
   );
}
