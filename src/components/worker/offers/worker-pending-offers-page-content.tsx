'use client';

import { useState } from 'react';
import { Clock3 } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { useWorkerPendingOffers } from '@/hooks/worker';
import { EmptyState } from '@/components/ui';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import { WorkerChatSheet } from '@/components/chat';
import { WorkerPendingOfferListItem } from './worker-pending-offer-list-item';

export function WorkerPendingOffersPageContent() {
   useAuthToken();
   const { offers, isLoading } = useWorkerPendingOffers();
   const [chatState, setChatState] = useState<{
      conversationId: number;
      orderId: number;
   } | null>(null);

   return (
      <AuthDashboardPageShell theme="worker">
         <AuthDashboardListSection
            theme="worker"
            title="عروضي المرسلة بانتظار الرد"
            icon={<Clock3 className="h-5 w-5" />}
            isLoading={isLoading}
            loadingText="جاري تحميل العروض..."
         >
            {offers.length === 0 ? (
               <EmptyState
                  icon={<Clock3 className="h-10 w-10" />}
                  title="لا يوجد عروض بانتظار الرد"
                  description="عندما ترسل عرض سعر جديد سيظهر هنا حتى يرد العميل."
               />
            ) : (
               <div className="space-y-4">
                  {offers.map((offer) => (
                     <WorkerPendingOfferListItem
                        key={offer.id}
                        offer={offer}
                        onOpenChat={(conversationId, orderId) =>
                           setChatState({ conversationId, orderId })
                        }
                     />
                  ))}
               </div>
            )}
         </AuthDashboardListSection>

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
