'use client';

import { useState, type ElementType } from 'react';
import { Clock3, Hash, TimerReset, Wallet, Wrench } from 'lucide-react';
import {
   AppModal,
   Input,
   Label,
   ModalActions,
   ModalPrimaryButton,
   ModalSecondaryButton,
} from '@/components/ui';
import type { WorkerPriceOfferDraft, WorkerOrder } from '@/types/entities';

interface PriceOfferModalProps {
   open: boolean;
   order: WorkerOrder | null;
   workerId: number;
   isSubmitting?: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit: (draft: WorkerPriceOfferDraft) => Promise<void> | void;
}

interface OfferMetaItemProps {
   label: string;
   value: string;
   icon: ElementType;
}

interface PriceOfferFormContentProps {
   order: WorkerOrder;
   workerId: number;
   isSubmitting?: boolean;
   onOpenChange: (open: boolean) => void;
   onSubmit: (draft: WorkerPriceOfferDraft) => Promise<void> | void;
}

function OfferMetaItem({ label, value, icon: Icon }: OfferMetaItemProps) {
   return (
      <div className="rounded-2xl border border-secondary/12 bg-primary/4 p-3">
         <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-4 w-4 text-secondary" />
            <span>{label}</span>
         </div>
         <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
      </div>
   );
}

function PriceOfferFormContent({
   order,
   workerId,
   isSubmitting = false,
   onOpenChange,
   onSubmit,
}: PriceOfferFormContentProps) {
   const [price, setPrice] = useState('');
   const [timeRange, setTimeRange] = useState('');

   const draft: WorkerPriceOfferDraft = {
      worker_id: workerId,
      order_id: order.id,
      price,
      time_range: timeRange,
      status: 'pending',
   };

   const isSubmitDisabled =
      !draft.price.trim() ||
      Number(draft.price) <= 0 ||
      !draft.time_range.trim();

   const handleSubmit = async () => {
      if (isSubmitDisabled) return;
      await onSubmit(draft);
   };

   return (
      <div className="space-y-5">
         <section className="rounded-3xl border border-secondary/15 bg-muted/45 p-4">
            <div className="space-y-3">
               <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-secondary/15 bg-secondary/8 px-3 py-1 text-xs font-medium text-secondary">
                     {order.career.name}
                  </span>
                  <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-xs text-muted-foreground">
                     {order.address.area_address.area_name}
                  </span>
               </div>
               <p className="text-sm leading-7 text-muted-foreground">
                  {order.description}
               </p>
            </div>
         </section>

         <section className="grid gap-3 sm:grid-cols-3">
            <OfferMetaItem
               label="رقم الفني"
               value={`#${draft.worker_id}`}
               icon={Wrench}
            />
            <OfferMetaItem
               label="رقم الطلب"
               value={`#${draft.order_id}`}
               icon={Hash}
            />
            <OfferMetaItem label="الحالة" value="قيد التجهيز" icon={Clock3} />
         </section>

         <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
               <Label htmlFor="price-offer-price">السعر المقترح</Label>
               <div className="relative">
                  <Wallet className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  <Input
                     id="price-offer-price"
                     type="number"
                     min="0"
                     step="0.01"
                     inputMode="decimal"
                     placeholder="مثال: 25000"
                     value={price}
                     onChange={(event) => setPrice(event.target.value)}
                     className="h-11 rounded-xl border-secondary/15 bg-ssecondary/3 pr-10"
                  />
               </div>
               <p className="text-xs text-muted-foreground">
                  أدخل قيمة العرض كما تريد أن تظهر لاحقاً للعميل.
               </p>
            </div>

            <div className="space-y-2">
               <Label htmlFor="price-offer-time-range">المدة المتوقعة</Label>
               <div className="relative">
                  <TimerReset className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                  <Input
                     id="price-offer-time-range"
                     type="text"
                     placeholder="مثال: خلال يومين إلى 3 أيام"
                     value={timeRange}
                     onChange={(event) => setTimeRange(event.target.value)}
                     className="h-11 rounded-xl border-primary/15 bg-secondary/3 pr-10"
                  />
               </div>
               <p className="text-xs text-muted-foreground">
                  `time_range` حقل نصي، لذلك اكتب المدة بصياغة مناسبة وواضحة.
               </p>
            </div>
         </section>

         <ModalActions className="border-secondary/10 pt-5" align="end">
            <ModalSecondaryButton
               theme="worker"
               onClick={() => onOpenChange(false)}
               disabled={isSubmitting}
               className="rounded-xl"
            >
               إلغاء
            </ModalSecondaryButton>
            <ModalPrimaryButton
               theme="worker"
               onClick={handleSubmit}
               disabled={isSubmitDisabled || isSubmitting}
               className="rounded-xl"
            >
               {isSubmitting ? 'جاري إرسال العرض...' : 'إرسال العرض'}
            </ModalPrimaryButton>
         </ModalActions>
      </div>
   );
}

export function PriceOfferModal({
   open,
   order,
   workerId,
   isSubmitting = false,
   onOpenChange,
   onSubmit,
}: PriceOfferModalProps) {
   if (!order) {
      return null;
   }

   return (
      <AppModal
         open={open}
         onOpenChange={onOpenChange}
         title={`إرسال عرض سعر للطلب #${order.id}`}
         description="املأ السعر والمدة المتوقعة، وسيتم ربط الإرسال مع الخادم في الخطوة التالية."
         size="lg"
         theme="worker"
         showCloseButton={false}
         contentClassName="bg-card/95"
      >
         <PriceOfferFormContent
            key={`${order.id}-${workerId}`}
            order={order}
            workerId={workerId}
            isSubmitting={isSubmitting}
            onOpenChange={onOpenChange}
            onSubmit={onSubmit}
         />
      </AppModal>
   );
}

export default PriceOfferModal;
