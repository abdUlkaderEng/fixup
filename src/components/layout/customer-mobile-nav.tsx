'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Home, Plus, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useShowCustomerMobileNav } from '@/hooks/use-customer-mobile-nav';

interface NavTab {
   name: string;
   href: string;
   icon: LucideIcon;
   isActive: (pathname: string) => boolean;
}

const HOME_TAB: NavTab = {
   name: 'الرئيسية',
   href: '/',
   icon: Home,
   isActive: (p) => p === '/',
};

const ORDERS_TAB: NavTab = {
   name: 'طلباتي',
   href: '/customer/orders',
   icon: ClipboardList,
   isActive: (p) =>
      p.startsWith('/customer/orders') &&
      !p.startsWith('/customer/orders/create'),
};

/**
 * Fixed bottom navigation bar for customers on mobile. Surfaces the primary
 * destinations (home, create order, my orders) outside the hamburger menu so
 * they're reachable with a thumb, with "create order" as the elevated center
 * call-to-action. Hidden on `md+` and on the admin/worker dashboards (see
 * `useShowCustomerMobileNav`). Account/profile lives in the top-bar menu.
 */
export function CustomerMobileNav() {
   const show = useShowCustomerMobileNav();
   const pathname = usePathname() ?? '';

   if (!show) return null;

   const isCreateActive = pathname.startsWith('/customer/orders/create');

   return (
      <nav
         aria-label="التنقل السريع"
         className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden"
      >
         <div className="flex h-16 items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
            <TabLink tab={HOME_TAB} active={HOME_TAB.isActive(pathname)} />

            {/* Center elevated call-to-action */}
            <Link
               href="/customer/orders/create"
               aria-label="إنشاء طلب"
               className="relative flex flex-1 flex-col items-center justify-end pb-2"
            >
               <span className="absolute -top-6 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95">
                  <Plus className="size-6" strokeWidth={2.5} />
               </span>
               <span
                  className={cn(
                     'text-[10px] font-medium leading-none',
                     isCreateActive ? 'text-primary' : 'text-muted-foreground'
                  )}
               >
                  إنشاء طلب
               </span>
            </Link>

            <TabLink tab={ORDERS_TAB} active={ORDERS_TAB.isActive(pathname)} />
         </div>
      </nav>
   );
}

function TabLink({ tab, active }: { tab: NavTab; active: boolean }) {
   const Icon = tab.icon;
   return (
      <Link
         href={tab.href}
         className="group flex flex-1 flex-col items-center justify-end gap-1 pb-2"
      >
         <span
            className={cn(
               'flex size-9 items-center justify-center rounded-xl transition-colors',
               active ? 'bg-primary/10' : 'bg-transparent'
            )}
         >
            <Icon
               className={cn(
                  'size-5',
                  active ? 'text-primary' : 'text-muted-foreground'
               )}
            />
         </span>
         <span
            className={cn(
               'text-[10px] font-medium leading-none',
               active ? 'text-primary' : 'text-muted-foreground'
            )}
         >
            {tab.name}
         </span>
      </Link>
   );
}
