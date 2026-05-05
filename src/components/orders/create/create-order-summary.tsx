'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SelectedServicesSidebar } from '@/components/orders/selected-services-sidebar';
import type { Service } from '@/types/admin/services';
import { PublicArea } from '@/types/entities';

export interface OrderSummaryData {
   careerName: string;
   services: Service[];
   description: string;
   area?: PublicArea;
   detailedAddress: string;
   latitude: number;
   longitude: number;
   imagesCount: number;
   priority: string;
}

interface CreateOrderSummaryProps {
   selectedServices: Service[];
   selectedCareerDisplayName: string;
   onClear: () => void;
   reviewData?: OrderSummaryData | null;
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
      <div className="relative bottom-0 self-end space-y-4 lg:sticky lg:top-20">
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
                  {reviewData.detailedAddress && (
                     <p>
                        <span className="font-medium text-foreground">
                           العنوان التفصيلي:
                        </span>{' '}
                        {reviewData.detailedAddress}
                     </p>
                  )}
                  {reviewData.description && (
                     <p>
                        <span className="font-medium text-foreground">
                           الوصف :
                        </span>{' '}
                        {reviewData.description}
                     </p>
                  )}
                  {reviewData.imagesCount !== 0 && (
                     <p>
                        <span className="font-medium text-foreground">
                           عدد الصور المضافة :
                        </span>{' '}
                        {reviewData.imagesCount}
                     </p>
                  )}
                  {reviewData.priority && (
                     <p>
                        <span className="font-medium text-foreground">
                           أولوية الطلب :
                        </span>{' '}
                        {reviewData.priority === 'normal' ? 'عادي' : 'مستعجل'}
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
