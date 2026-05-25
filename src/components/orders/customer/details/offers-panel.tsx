'use client';

import { BadgeDollarSign } from 'lucide-react';
import { SectionPanel } from '@/components/ui';
import type { OrderOffer } from '@/types/entities/order';
import { formatOrderDate } from '../order-utils';
import { OfferStatusBadge } from './offer-status-badge';
import { ChatTrigger } from './chat-trigger';

export function OffersPanel({ offers }: { offers: OrderOffer[] }) {
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

   return (
      <SectionPanel
         title={`عروض الأسعار (${offers.length})`}
         icon={<BadgeDollarSign className="h-5 w-5" />}
         className="border-border/60"
      >
         <div className="space-y-3">
            {offers.map((offer) => (
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
                     <ChatTrigger offer={offer} />
                  </div>
               </div>
            ))}
         </div>
      </SectionPanel>
   );
}
