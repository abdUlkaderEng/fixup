'use client';

import { useSession } from 'next-auth/react';
import { BriefcaseBusiness, Loader2 } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { useWorkerOrders } from '@/hooks/worker';
import { EmptyState, SectionPanel } from '@/components/ui';
import { WorkerDashboardHeader } from './worker-dashboard-header';
import { WorkerDashboardOverview } from './worker-dashboard-overview';
import { WorkerOrderListItem } from './worker-order-list-item';

export function WorkerDashboardPageContent() {
   useAuthToken();

   const { data: session } = useSession();
   const { orders, isLoading } = useWorkerOrders();

   const firstName = (session?.user?.name || 'الفني').split(' ')[0];
   const pendingCount = orders.filter(
      (order) => order.status === 'pending'
   ).length;

   const handleSendOffer = (orderId: number) => {
      console.log('Send offer for order', orderId);
   };

   return (
      <div className="  worker-dashboard-shell">
         <div className="container mx-auto px-4">
            <WorkerDashboardHeader
               firstName={firstName}
               pendingCount={pendingCount}
            />

            <div className="space-y-6">
               <WorkerDashboardOverview orders={orders} />

               <SectionPanel
                  title="الطلبات المتاحة"
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  className="border-border/60"
               >
                  {isLoading ? (
                     <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm">جاري تحميل الطلبات...</p>
                     </div>
                  ) : orders.length === 0 ? (
                     <EmptyState
                        icon={<BriefcaseBusiness className="h-10 w-10" />}
                        title="لا توجد طلبات متاحة حالياً"
                        description="عند وصول طلبات جديدة ضمن نطاقك وتخصصك، ستظهر هنا بنفس التنسيق لتتمكن من مراجعتها بسرعة."
                     />
                  ) : (
                     <div className="space-y-4">
                        {orders.map((order) => (
                           <WorkerOrderListItem
                              key={order.id}
                              order={order}
                              onSendOffer={handleSendOffer}
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

export default WorkerDashboardPageContent;
