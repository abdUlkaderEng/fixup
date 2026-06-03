'use client';

import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { StarRating } from '@/components/ui/star-rating';
import { useRateOrder } from '@/hooks';

interface RateWorkerButtonProps {
   orderId: number;
   /** Called after the rating is successfully submitted (e.g. to refetch). */
   onRated?: () => void;
}

/**
 * Rate-the-worker action for a completed customer order. Opens a dialog with a
 * star control; clicking a star posts that rating (1–5) to the rate endpoint.
 */
export function RateWorkerButton({ orderId, onRated }: RateWorkerButtonProps) {
   const [open, setOpen] = useState(false);

   const { rateOrder, isLoading } = useRateOrder({
      onSuccess: () => {
         setOpen(false);
         onRated?.();
      },
   });

   const handleSelect = (rate: number) => {
      void rateOrder({ orderId, rate });
   };

   return (
      <>
         <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 rounded-xl border-amber-300/60 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => setOpen(true)}
         >
            <Star className="h-4 w-4" />
            تقييم الفني
         </Button>

         <Dialog
            open={open}
            onOpenChange={(next) => {
               if (!isLoading) setOpen(next);
            }}
         >
            <DialogContent className="max-w-sm">
               <DialogHeader>
                  <DialogTitle className="text-center">تقييم الفني</DialogTitle>
                  <DialogDescription className="text-center">
                     اضغط على النجوم لإرسال تقييمك للفني الذي نفّذ الطلب.
                  </DialogDescription>
               </DialogHeader>

               <div className="flex flex-col items-center gap-3 py-4">
                  <StarRating onChange={handleSelect} disabled={isLoading} />
                  {isLoading ? (
                     <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري إرسال التقييم...
                     </span>
                  ) : null}
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}

export default RateWorkerButton;
