'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { useCancelOrder } from '@/hooks';

interface CancelOrderButtonProps {
   orderId: number;
   /** Called after the order is successfully cancelled (e.g. to refetch). */
   onCancelled?: () => void;
}

/**
 * Cancel action for a customer order. Only rendered for orders that have not
 * received any price offers — once offers arrive the order can no longer be
 * cancelled. Opens a confirmation dialog before hitting the cancel endpoint.
 */
export function CancelOrderButton({
   orderId,
   onCancelled,
}: CancelOrderButtonProps) {
   const [open, setOpen] = useState(false);

   const { cancelOrder, isLoading } = useCancelOrder({
      onSuccess: () => {
         setOpen(false);
         onCancelled?.();
      },
   });

   return (
      <>
         <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setOpen(true)}
            disabled={isLoading}
         >
            <XCircle className="h-4 w-4" />
            إلغاء الطلب
         </Button>

         <DeleteConfirmDialog
            open={open}
            onOpenChange={setOpen}
            onConfirm={() => cancelOrder({ orderId })}
            isLoading={isLoading}
            title="تأكيد إلغاء الطلب"
            confirmLabel="نعم، إلغاء الطلب"
            cancelLabel="تراجع"
            variant="destructive"
            description="هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
         />
      </>
   );
}

export default CancelOrderButton;
