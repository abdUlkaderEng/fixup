'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SelectedServicesSidebar } from '@/components/orders/selected-services-sidebar';
import type { Service } from '@/types/admin/services';
import type { OrderReviewData } from './order-review';

interface CreateOrderSummaryProps {
   selectedServices: Service[];
   selectedCareerDisplayName: string;
   onClear: () => void;
   reviewData?: OrderReviewData | null;
   onConfirm?: () => void;
   isSubmitting?: boolean;
}

export function CreateOrderSummary({
   selectedServices,
   selectedCareerDisplayName,
   onClear,
   reviewData,
   onConfirm,
   isSubmitting,
}: CreateOrderSummaryProps) {
   return (
      <div className="sticky top-20 bottom-0 self-end space-y-4">
         <SelectedServicesSidebar
            selectedServices={selectedServices}
            onClear={onClear}
         />

         <div className=" rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">مراجعة سريعة</p>
            <p>التصنيف: {selectedCareerDisplayName}</p>
            <p>عدد الخدمات: {selectedServices.length}</p>

            {reviewData && (
               <div className="mt-3 space-y-1 border-t border-border/50 pt-3">
                  {reviewData.area && (
                     <p>
                        <span className="font-medium text-foreground">
                           المنطقة:
                        </span>{' '}
                        {reviewData.area.area_name}
                     </p>
                  )}
               </div>
            )}
         </div>

         {reviewData && onConfirm && (
            <Button
               type="button"
               className="h-11 w-full text-base font-semibold"
               onClick={onConfirm}
               disabled={isSubmitting}
            >
               {isSubmitting ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                     جاري الإرسال...
                  </>
               ) : (
                  'تأكيد وإرسال الطلب'
               )}
            </Button>
         )}
      </div>
   );
}

export default CreateOrderSummary;
