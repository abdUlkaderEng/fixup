'use client';

import { ClipboardList } from 'lucide-react';
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
}: CustomerOrdersStatusPanelProps) {
   const { orders, isLoading, refetch } = useCustomerOrders({ status });

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
