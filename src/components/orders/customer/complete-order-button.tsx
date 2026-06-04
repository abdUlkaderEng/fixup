'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { useCompleteOrder } from '@/hooks';

interface CompleteOrderButtonProps {
   orderId: number;
   /** Called after the order is successfully completed (e.g. to refetch). */
   onCompleted?: () => void;
}

/**
 * Complete-order action for customers. Opens a confirmation dialog before
 * hitting the complete endpoint, then clears caches and calls `onCompleted`.
 */
export function CompleteOrderButton({
   orderId,
   onCompleted,
}: CompleteOrderButtonProps) {
   const [open, setOpen] = useState(false);

   const { completeOrder, isLoading } = useCompleteOrder({
      onSuccess: () => {
         setOpen(false);
         onCompleted?.();
      },
   });

   return (
      <>
         <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => setOpen(true)}
            disabled={isLoading}
         >
            <CheckCircle2 className="h-4 w-4" />
            إتمام الطلب
         </Button>

         <DeleteConfirmDialog
            open={open}
            onOpenChange={setOpen}
            onConfirm={() => completeOrder({ orderId })}
            isLoading={isLoading}
            title="تأكيد إتمام الطلب"
            confirmLabel="نعم، إتمام الطلب"
            cancelLabel="تراجع"
            variant="default"
            description="هل أنت متأكد من إتمام هذا الطلب؟ سيتم اعتباره مكتملًا بعد التأكيد."
         />
      </>
   );
}

export default CompleteOrderButton;
