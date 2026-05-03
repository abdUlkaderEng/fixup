'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { BriefcaseBusiness } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { usePriceOffer, useWorkerOrders } from '@/hooks/worker';
import { EmptyState } from '@/components/ui';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import type { WorkerPriceOfferDraft, WorkerOrder } from '@/types/entities';
import { PriceOfferModal } from './price-offer-modal';
import { WorkerDashboardHeader } from './worker-dashboard-header';
import { WorkerDashboardOverview } from './worker-dashboard-overview';
import { WorkerOrderListItem } from './worker-order-list-item';

export function WorkerDashboardPageContent() {
   useAuthToken();

   const { data: session } = useSession();
   const { orders, isLoading } = useWorkerOrders();
   const { submitPriceOffer, isSubmittingPriceOffer } = usePriceOffer();
   const [selectedOrder, setSelectedOrder] = useState<WorkerOrder | null>(null);
   const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

   const firstName = (session?.user?.name || 'الفني').split(' ')[0];
   const pendingCount = orders.filter(
      (order) => order.status === 'pending'
   ).length;
   const workerId = Number(session?.user?.worker?.id ?? session?.user?.id ?? 0);

   const handleSendOffer = (order: WorkerOrder) => {
      setSelectedOrder(order);
      setIsOfferModalOpen(true);
   };

   const handleOfferModalChange = (open: boolean) => {
      setIsOfferModalOpen(open);

      if (!open) {
         setSelectedOrder(null);
      }
   };

   const handleSubmitOffer = async (draft: WorkerPriceOfferDraft) => {
      await submitPriceOffer(draft);
      handleOfferModalChange(false);
   };

   return (
      <AuthDashboardPageShell theme="worker">
         <WorkerDashboardHeader
            firstName={firstName}
            pendingCount={pendingCount}
         />

         <div className="space-y-6">
            <WorkerDashboardOverview orders={orders} />

            <AuthDashboardListSection
               theme="worker"
               title="الطلبات المتاحة"
               icon={<BriefcaseBusiness className="h-5 w-5" />}
               isLoading={isLoading}
               loadingText="جاري تحميل الطلبات..."
            >
               {orders.length === 0 ? (
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
            </AuthDashboardListSection>
         </div>

         <PriceOfferModal
            open={isOfferModalOpen}
            order={selectedOrder}
            workerId={workerId}
            isSubmitting={isSubmittingPriceOffer}
            onOpenChange={handleOfferModalChange}
            onSubmit={handleSubmitOffer}
         />
      </AuthDashboardPageShell>
   );
}

export default WorkerDashboardPageContent;
