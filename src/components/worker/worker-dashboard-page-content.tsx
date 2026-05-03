'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { BriefcaseBusiness, Loader2 } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { usePriceOffer, useWorkerOrders } from '@/hooks/worker';
import { EmptyState, SectionPanel } from '@/components/ui';
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
      <div className="app-page-gradient  worker-dashboard-shell">
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

         <PriceOfferModal
            open={isOfferModalOpen}
            order={selectedOrder}
            workerId={workerId}
            isSubmitting={isSubmittingPriceOffer}
            onOpenChange={handleOfferModalChange}
            onSubmit={handleSubmitOffer}
         />
      </div>
   );
}

export default WorkerDashboardPageContent;
