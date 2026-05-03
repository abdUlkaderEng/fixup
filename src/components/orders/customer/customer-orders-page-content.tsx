'use client';

import { ClipboardList, Loader2 } from 'lucide-react';
import { useAuthToken, useCustomerOrders } from '@/hooks';
import { EmptyState, SectionPanel } from '@/components/ui';
import { CustomerOrderListItem } from './customer-order-list-item';
import { CustomerOrdersHeader } from './customer-orders-header';
import { CustomerOrdersOverview } from './customer-orders-overview';

export function CustomerOrdersPageContent() {
   useAuthToken();

   const { orders, isLoading } = useCustomerOrders();

   return (
      <div className="app-page-gradient app-page-spacing">
         <div className="container mx-auto px-4">
            <CustomerOrdersHeader />

            <div className="space-y-6">
               <CustomerOrdersOverview orders={orders} />

               <SectionPanel
                  title="سجل الطلبات"
                  icon={<ClipboardList className="h-5 w-5" />}
                  className="border-border/60"
               >
                  {isLoading ? (
                     <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm">جاري تحميل الطلبات...</p>
                     </div>
                  ) : orders.length === 0 ? (
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
                           />
                        ))}
                     </div>
                  )}
               </SectionPanel>
            </div>
         </div>
      </div>
   );
}

export default CustomerOrdersPageContent;
