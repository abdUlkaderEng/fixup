'use client';

import { useState } from 'react';
import {
   BadgeCheck,
   Ban,
   Banknote,
   CheckCircle2,
   Clock3,
   Hourglass,
   type LucideIcon,
   XCircle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
   CustomerOrder,
   CustomerOrderFilterStatus,
} from '@/types/entities/order';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';
import { CustomerOrdersStatusPanel } from './customer-orders-status-panel';

interface OrderTab {
   /** Unique tab id (decoupled from the server status). */
   value: string;
   /** Server-side status filter for this tab. */
   status: CustomerOrderFilterStatus;
   label: string;
   icon: LucideIcon;
   emptyDescription: string;
   /** Optional client-side refinement (e.g. split pending by offers). */
   filter?: (orders: CustomerOrder[]) => CustomerOrder[];
   /** Show a cancel button on each order in this tab. */
   cancellable?: boolean;
   /** Show a "rate worker" button on each order in this tab. */
   rateable?: boolean;
}

const hasOffers = (order: CustomerOrder) => order.offers.length > 0;

// Treat orders past their expiry as no longer pending. The backend doesn't
// always flip the status (e.g. it doesn't re-expire on a local dev restart),
// so we re-filter pending orders by `expires_at` on the client.
const isLive = (order: CustomerOrder) =>
   new Date(order.expires_at).getTime() > Date.now();

const ORDER_TABS: OrderTab[] = [
   {
      value: 'awaiting-offers',
      status: 'pending',
      label: 'بانتظار العروض',
      icon: Clock3,
      emptyDescription: 'لا توجد طلبات بانتظار العروض حالياً.',
      filter: (orders) =>
         orders.filter((order) => isLive(order) && !hasOffers(order)),
      cancellable: true,
   },
   {
      value: 'with-offers',
      status: 'pending',
      label: 'وصلتها عروض',
      icon: Banknote,
      emptyDescription: 'لا توجد طلبات وصلتها عروض بعد.',
      filter: (orders) =>
         orders.filter((order) => isLive(order) && hasOffers(order)),
   },
   {
      value: 'accepted',
      status: 'accepted',
      label: 'مقبولة',
      icon: CheckCircle2,
      emptyDescription: 'لا توجد طلبات مقبولة حالياً.',
   },
   {
      value: 'completed',
      status: 'completed',
      label: 'مكتملة',
      icon: BadgeCheck,
      emptyDescription: 'لا توجد طلبات مكتملة.',
      rateable: true,
   },
   {
      value: 'rejected',
      status: 'rejected',
      label: 'مرفوضة',
      icon: XCircle,
      emptyDescription: 'لا توجد طلبات مرفوضة.',
   },
   {
      value: 'expired',
      status: 'expired',
      label: 'منتهية',
      icon: Hourglass,
      emptyDescription: 'لا توجد طلبات منتهية الصلاحية.',
   },
   {
      value: 'cancelled',
      status: 'cancelled',
      label: 'ملغاة',
      icon: Ban,
      emptyDescription: 'لا توجد طلبات ملغاة.',
   },
];

interface CustomerOrdersStatusTabsProps {
   careers?: PublicCareer[];
   areas?: PublicArea[];
}

/**
 * Child navbar for the orders page: one tab per order state. Pending orders are
 * split into "awaiting offers" (cancellable) and "received offers" tabs; each
 * tab renders the same list layout, filtered server-side by status.
 */
export function CustomerOrdersStatusTabs({
   careers,
   areas,
}: CustomerOrdersStatusTabsProps) {
   const [tab, setTab] = useState<string>(ORDER_TABS[0].value);

   return (
      <Tabs dir="rtl" value={tab} onValueChange={setTab} className="w-full">
         <TabsList className="sticky top-20 z-30 flex h-auto! min-h-fit w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-muted/95 p-2 shadow-sm backdrop-blur supports-backdrop-filter:bg-muted/80">
            {ORDER_TABS.map(({ value, label, icon: Icon }) => (
               <TabsTrigger
                  key={value}
                  value={value}
                  className="h-auto! flex-none gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-background/60 hover:text-foreground data-active:bg-background data-active:text-primary data-active:shadow-sm data-active:ring-1 data-active:ring-primary/20"
               >
                  <Icon className="h-4 w-4" />
                  {label}
               </TabsTrigger>
            ))}
         </TabsList>

         {ORDER_TABS.map(
            ({
               value,
               status,
               emptyDescription,
               filter,
               cancellable,
               rateable,
            }) => (
               <TabsContent key={value} value={value} className="mt-4">
                  <CustomerOrdersStatusPanel
                     status={status}
                     emptyDescription={emptyDescription}
                     filter={filter}
                     cancellable={cancellable}
                     rateable={rateable}
                     careers={careers}
                     areas={areas}
                  />
               </TabsContent>
            )
         )}
      </Tabs>
   );
}

export default CustomerOrdersStatusTabs;
