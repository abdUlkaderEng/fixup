'use client';

import { useCallback, useState } from 'react';
import { ClipboardList, Star } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { AuthDashboardListSection } from '@/components/AuthDashboard';
import { useCustomerOrders } from '@/hooks';
import type {
   CustomerOrder,
   CustomerOrderFilterStatus,
} from '@/types/entities/order';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';
import { CustomerOrderListItem } from './customer-order-list-item';
import { CancelOrderButton } from './cancel-order-button';
import { RateWorkerButton } from './rate-worker-button';
import CompleteOrderButton from './complete-order-button';

interface CustomerOrdersStatusPanelProps {
   status: CustomerOrderFilterStatus;
   /** Message shown when no orders match this tab. */
   emptyDescription: string;
   careers?: PublicCareer[];
   areas?: PublicArea[];
   /** Optional client-side refinement applied after the server status filter. */
   filter?: (orders: CustomerOrder[]) => CustomerOrder[];
   /** Render a cancel button on each order (only used for offer-less orders). */
   cancellable?: boolean;
   /** Render a "rate worker" button on each order (only used for completed orders). */
   rateable?: boolean;
   completed?: boolean;
}

/**
 * Orders list for a single tab. Reuses the same list design as the orders page
 * (section panel + order cards) without the dashboard header, fetching orders
 * filtered server-side by status and optionally refining them client-side.
 */
export function CustomerOrdersStatusPanel({
   status,
   emptyDescription,
   careers = [],
   areas = [],
   filter,
   cancellable = false,
   rateable = false,
   completed = false,
}: CustomerOrdersStatusPanelProps) {
   const { orders, isLoading, refetch } = useCustomerOrders({ status });

   // Orders rated during this session. We track them locally so the rate button
   // flips to "rated" immediately and stays that way, even if the backend list
   // doesn't echo `is_rating` on the follow-up refetch.
   const [ratedOrderIds, setRatedOrderIds] = useState<Set<number>>(
      () => new Set()
   );

   const handleRated = useCallback(
      (orderId: number) => {
         setRatedOrderIds((prev) => {
            const next = new Set(prev);
            next.add(orderId);
            return next;
         });
         refetch();
      },
      [refetch]
   );

   const visibleOrders = filter ? filter(orders) : orders;

   return (
      <AuthDashboardListSection
         theme="customer"
         title="سجل الطلبات"
         icon={<ClipboardList className="h-5 w-5" />}
         isLoading={isLoading}
         loadingText="جاري تحميل الطلبات..."
      >
         {visibleOrders.length === 0 ? (
            <EmptyState
               icon={<ClipboardList className="h-10 w-10" />}
               title="لا توجد طلبات"
               description={emptyDescription}
            />
         ) : (
            <div className="space-y-4">
               {visibleOrders.map((order) => (
                  <CustomerOrderListItem
                     key={order.id}
                     order={order}
                     careers={careers}
                     areas={areas}
                     action={
                        cancellable ? (
                           <CancelOrderButton
                              orderId={order.id}
                              onCancelled={refetch}
                           />
                        ) : rateable ? (
                           order.is_rating || ratedOrderIds.has(order.id) ? (
                              <span className="inline-flex items-center gap-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                                 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                 تم تقييم الفني
                              </span>
                           ) : (
                              <RateWorkerButton
                                 orderId={order.id}
                                 onRated={() => handleRated(order.id)}
                              />
                           )
                        ) : completed ? (
                           <CompleteOrderButton
                              orderId={order.id}
                              onCompleted={refetch}
                           />
                        ) : undefined
                     }
                  />
               ))}
            </div>
         )}
      </AuthDashboardListSection>
   );
}

export default CustomerOrdersStatusPanel;
