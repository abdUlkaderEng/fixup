'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAcceptOffer } from '@/hooks/customer';
import type { OrderOffer } from '@/types/entities/order';

interface AcceptOfferButtonProps {
   offer: OrderOffer;
   /** Fired after the backend confirms the accept. Use to refetch the order. */
   onAccepted?: () => void;
}

/**
 * Customer-side "accept offer" trigger.
 *
 * Renders a button next to the chat button on a pending offer. Clicking it
 * opens a warning confirm dialog ("final, no undo"). Confirming hits
 * `POST /orders/{order_id}/offers/{offer_id}/accept` and calls `onAccepted`.
 *
 * Note: the parent (OffersPanel) decides whether to render this button at
 * all based on offer.status / order.status — once an offer is accepted no
 * button should appear on any of the order's offers.
 */
export function AcceptOfferButton({
   offer,
   onAccepted,
}: AcceptOfferButtonProps) {
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   const { acceptOffer, isLoading } = useAcceptOffer({
      onSuccess: () => {
         setIsDialogOpen(false);
         onAccepted?.();
      },
   });

   const handleConfirm = () => {
      void acceptOffer({ orderId: offer.order_id, offerId: offer.id });
   };

   return (
      <>
         <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            disabled={isLoading}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
         >
            <CheckCircle2 className="h-4 w-4" />
            قبول العرض
         </Button>

         <ConfirmDialog
            open={isDialogOpen}
            onOpenChange={(open) => {
               // Don't allow closing while the mutation is running.
               if (isLoading) return;
               setIsDialogOpen(open);
            }}
            onConfirm={handleConfirm}
            isLoading={isLoading}
            variant="warning"
            title="تأكيد قبول العرض"
            confirmLabel="نعم، قبول العرض"
            cancelLabel="إلغاء"
            confirmIcon={<CheckCircle2 className="h-4 w-4" />}
            description={
               <span className="block space-y-2 text-sm leading-7">
                  <span className="block">
                     سيتم قبول هذا العرض بسعر{' '}
                     <span className="font-semibold text-foreground">
                        {offer.price} ر.س
                     </span>{' '}
                     ضمن{' '}
                     <span className="font-semibold text-foreground">
                        {offer.time_range}
                     </span>
                     .
                  </span>
                  <span className="block font-medium text-amber-700">
                     هذا الإجراء نهائي ولا يمكن التراجع عنه.
                  </span>
               </span>
            }
         />
      </>
   );
}

export default AcceptOfferButton;
