'use client';

import { BadgeDollarSign } from 'lucide-react';
import { SectionPanel } from '@/components/ui';
import type { CustomerOrder, OrderOffer } from '@/types/entities/order';
import { formatOrderDate } from '../order-utils';
import { OfferStatusBadge } from './offer-status-badge';
import { ChatTrigger } from './chat-trigger';
import { AcceptOfferButton } from './accept-offer-button';

interface OffersPanelProps {
   offers: OrderOffer[];
   /** Order status — accept buttons only show while the order is still pending. */
   orderStatus: CustomerOrder['status'];
   /** Fired after a successful accept so the parent can refetch the order. */
   onOfferAccepted?: () => void;
}

export function OffersPanel({
   offers,
   orderStatus,
   onOfferAccepted,
}: OffersPanelProps) {
   if (offers.length === 0) {
      return (
         <SectionPanel
            title="عروض الأسعار"
            icon={<BadgeDollarSign className="h-5 w-5" />}
            className="border-border/60"
         >
            <p className="py-4 text-center text-sm text-muted-foreground">
               لم يصل أي عرض سعر بعد
            </p>
         </SectionPanel>
      );
   }

   // Accept is only meaningful while the order is still pending. Once any
   // offer is accepted the order moves to `accepted` and no more accept
   // buttons should appear on any offer.
   const canAcceptOnOrder = orderStatus === 'pending';

   return (
      <SectionPanel
         title={`عروض الأسعار (${offers.length})`}
         icon={<BadgeDollarSign className="h-5 w-5" />}
         className="border-border/60"
      >
         <div className="space-y-3">
            {offers.map((offer) => {
               const canAcceptOffer =
                  canAcceptOnOrder && offer.status === 'pending';

               return (
                  <div
                     key={offer.id}
                     className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                     <div className="space-y-1">
                        <p className="text-lg font-bold text-foreground">
                           {offer.price} ر.س
                        </p>
                        <p className="text-xs text-muted-foreground">
                           {offer.time_range}
                        </p>
                     </div>
                     <div className="flex flex-col items-start gap-2 sm:items-end">
                        <OfferStatusBadge status={offer.status} />
                        <p className="text-xs text-muted-foreground">
                           {formatOrderDate(offer.created_at)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                           <ChatTrigger offer={offer} />
                           {canAcceptOffer && (
                              <AcceptOfferButton
                                 offer={offer}
                                 onAccepted={onOfferAccepted}
                              />
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </SectionPanel>
   );
}
