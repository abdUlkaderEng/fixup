'use client';

import { ClipboardList } from 'lucide-react';
import {
   useAuthToken,
   useCustomerOrders,
   usePublicAreas,
   usePublicCareers,
} from '@/hooks';
import { EmptyState } from '@/components/ui';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import { CustomerOrderListItem } from './customer-order-list-item';
import { CustomerOrdersHeader } from './customer-orders-header';
import { CustomerOrdersOverview } from './customer-orders-overview';

export function CustomerOrdersPageContent() {
   useAuthToken();

   const { orders, isLoading } = useCustomerOrders();
   const { careers } = usePublicCareers();
   const { areas } = usePublicAreas();

   return (
      <AuthDashboardPageShell theme="customer">
         <CustomerOrdersHeader />

         <div className="space-y-6">
            <CustomerOrdersOverview orders={orders} />

            <AuthDashboardListSection
               theme="customer"
               title="سجل الطلبات"
               icon={<ClipboardList className="h-5 w-5" />}
               isLoading={isLoading}
               loadingText="جاري تحميل الطلبات..."
            >
               {orders.length === 0 ? (
                  <EmptyState
                     icon={<ClipboardList className="h-10 w-10" />}
                     title="لا توجد طلبات بعد"
                     description="ابدأ بإنشاء أول طلب خدمة، وستظهر تفاصيله هنا بمجرد إرساله."
                  />
               ) : (
                  <div className="space-y-4">
                     {orders.map((order) => (
                        <CustomerOrderListItem
                           key={order.id}
                           order={order}
                           careers={careers}
                           areas={areas}
                        />
                     ))}
                  </div>
               )}
            </AuthDashboardListSection>
         </div>
      </AuthDashboardPageShell>
   );
}

export default CustomerOrdersPageContent;
