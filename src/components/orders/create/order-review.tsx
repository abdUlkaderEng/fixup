'use client';

import { CheckCircle2, FileText, MapPin, Package } from 'lucide-react';

import { AppModal } from '@/components/ui/app-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types/entities/service';
import type { PublicArea } from '@/types/public';

export interface OrderReviewData {
   careerName: string;
   services: Service[];
   description: string;
   area?: PublicArea;
   detailedAddress: string;
   latitude: number;
   longitude: number;
   imagesCount: number;
}

interface OrderReviewProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isSubmitting: boolean;
   reviewData: OrderReviewData | null;
}

export function OrderReview({
   open,
   onOpenChange,
   onConfirm,
   isSubmitting,
   reviewData,
}: OrderReviewProps) {
   if (!reviewData) {
      return null;
   }

   return (
      <AppModal
         open={open}
         onOpenChange={onOpenChange}
         title="مراجعة الطلب"
         description="راجع بيانات الطلب قبل الإرسال"
         size="lg"
         theme="customer"
         showCloseButton={false}
         className="order-review-modal"
         headerClassName="order-review-header"
         contentClassName="order-review-content"
      >
         <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <CheckCircle2 className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="font-semibold text-foreground">
                     {reviewData.careerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     {reviewData.services.length} خدمة مختارة
                  </p>
               </div>
            </div>

            {/* Services */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
               <div className="mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">الخدمات</span>
               </div>
               <div className="flex flex-wrap gap-2">
                  {reviewData.services.map((service) => (
                     <Badge
                        key={service.id}
                        variant="secondary"
                        className="h-8 rounded-full border border-border/50 px-3 text-sm"
                     >
                        {service.name}
                     </Badge>
                  ))}
               </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
               <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">الوصف</span>
               </div>
               <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">
                  {reviewData.description}
               </p>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-border/70 bg-card p-4">
               <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">الموقع</span>
               </div>
               <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                     <span className="font-medium text-foreground">
                        المنطقة:
                     </span>{' '}
                     {reviewData.area?.area_name ?? 'غير محددة'}
                  </p>
                  <p className="text-muted-foreground">
                     <span className="font-medium text-foreground">
                        العنوان:
                     </span>{' '}
                     {reviewData.detailedAddress}
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-4 sm:flex-row sm:justify-end">
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="h-11"
               >
                  تعديل
               </Button>
               <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="h-11"
               >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
               </Button>
            </div>
         </div>
      </AppModal>
   );
}

export default OrderReview;
