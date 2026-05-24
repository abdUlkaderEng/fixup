'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BriefcaseBusiness } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import {
   useWorkerPriceOffer,
   useWorkerOrders,
   useWorkerPendingOffers,
} from '@/hooks/worker';
import { EmptyState } from '@/components/ui';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import { onFcmMessage } from '@/lib/notification-events';
import { WorkerChatSheet } from '@/components/chat';
import type { WorkerPriceOfferDraft, WorkerOrder } from '@/types/entities';
import { PriceOfferModal } from '../orders/price-offer-modal';
import { WorkerOrderListItem } from '../orders/worker-order-list-item';
import { WorkerDashboardHeader } from './worker-dashboard-header';
import { WorkerDashboardOverview } from './worker-dashboard-overview';

export function WorkerDashboardPageContent() {
   useAuthToken();

   const { data: session } = useSession();
   const { orders, isLoading, refetch, removeOrder } = useWorkerOrders();
   const {
      offeredOrderIds,
      markOrderAsOffered,
      refetch: refetchOffers,
   } = useWorkerPendingOffers();
   const { submitPriceOffer, isSubmittingPriceOffer } = useWorkerPriceOffer();
   const [selectedOrder, setSelectedOrder] = useState<WorkerOrder | null>(null);
   const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
   const [chatState, setChatState] = useState<{
      conversationId: number;
      orderId: number;
   } | null>(null);

   useEffect(() => {
      return onFcmMessage((detail) => {
         const type = detail.data?.type;
         const conversationId = Number(detail.data?.conversation_id);
         const orderId = Number(detail.data?.order_id);
         if (type === 'new_conversation' && conversationId > 0) {
            setChatState({ conversationId, orderId });
         }
      });
   }, []);

   const firstName = (session?.user?.name || 'الفني').split(' ')[0];
   // Hide orders the worker has already submitted an offer for (each worker
   // gets one offer per order — backend tracks this via /worker/offers).
   const visibleOrders = orders.filter(
      (order) => !offeredOrderIds.has(order.id)
   );
   const pendingCount = visibleOrders.filter(
      (order) => order.status === 'pending'
   ).length;
   const workerId = Number(session?.user?.worker?.id ?? session?.user?.id ?? 0);
   const workerStatus = session?.user?.worker?.status as
      | 'active'
      | 'waiting'
      | 'blocked'
      | undefined;

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
      // Instant UX: drop the order from the list now…
      removeOrder(draft.order_id);
      markOrderAsOffered(draft.order_id);
      // …and reconcile both lists with the server.
      try {
         refetch();
         refetchOffers();
      } catch {
         // ignore
      }
      handleOfferModalChange(false);
   };

   return (
      <AuthDashboardPageShell theme="worker">
         <WorkerDashboardHeader
            firstName={firstName}
            pendingCount={pendingCount}
            workerStatus={workerStatus}
         />

         <div className="space-y-6">
            <WorkerDashboardOverview orders={visibleOrders} />

            <AuthDashboardListSection
               theme="worker"
               title="الطلبات المتاحة"
               icon={<BriefcaseBusiness className="h-5 w-5" />}
               isLoading={isLoading}
               loadingText="جاري تحميل الطلبات..."
            >
               {visibleOrders.length === 0 ? (
                  <EmptyState
                     icon={<BriefcaseBusiness className="h-10 w-10" />}
                     title="لا توجد طلبات متاحة حالياً"
                     description="عند وصول طلبات جديدة ضمن نطاقك وتخصصك، ستظهر هنا بنفس التنسيق لتتمكن من مراجعتها بسرعة."
                  />
               ) : (
                  <div className="space-y-4">
                     {visibleOrders.map((order) => (
                        <WorkerOrderListItem
                           key={order.id}
                           order={order}
                           onSendOffer={handleSendOffer}
                           workerStatus={workerStatus}
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

         <WorkerChatSheet
            open={!!chatState}
            onOpenChange={(open) => {
               if (!open) setChatState(null);
            }}
            conversationId={chatState?.conversationId ?? 0}
            orderId={chatState?.orderId ?? 0}
         />
      </AuthDashboardPageShell>
   );
}

export default WorkerDashboardPageContent;
