'use client';

import { CheckCircle2 } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { useWorkerConfirmedOrders } from '@/hooks/worker';
import { EmptyState } from '@/components/ui';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import { WorkerConfirmedOrderListItem } from './worker-confirmed-order-list-item';

export function WorkerConfirmedOrdersPageContent() {
   useAuthToken();
   const { orders, isLoading } = useWorkerConfirmedOrders();

   return (
      <AuthDashboardPageShell theme="worker">
         <AuthDashboardListSection
            theme="worker"
            title="الطلبات المؤكدة"
            icon={<CheckCircle2 className="h-5 w-5" />}
            isLoading={isLoading}
            loadingText="جاري تحميل الطلبات المؤكدة..."
         >
            {orders.length === 0 ? (
               <EmptyState
                  icon={<CheckCircle2 className="h-10 w-10" />}
                  title="لا يوجد طلبات مؤكدة"
                  description="بعد تأكيد العرض من الطرفين، ستظهر تفاصيل العميل والطلب هنا."
               />
            ) : (
               <div className="space-y-4">
                  {orders.map((order) => (
                     <WorkerConfirmedOrderListItem
                        key={order.id}
                        order={order}
                     />
                  ))}
               </div>
            )}
         </AuthDashboardListSection>
      </AuthDashboardPageShell>
   );
}
