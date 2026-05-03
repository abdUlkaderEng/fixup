'use client';

import { CalendarDays, Clock3, MapPin, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { WorkerOrder } from '@/types/entities/order';
import {
   formatWorkerOrderDate,
   getWorkerOrderExpiryLabel,
   getWorkerOrderPriorityLabel,
   getWorkerOrderStatusMeta,
} from './worker-order-utils';

interface WorkerOrderListItemProps {
   order: WorkerOrder;
   onSendOffer: (orderId: number) => void;
}

export function WorkerOrderListItem({
   order,
   onSendOffer,
}: WorkerOrderListItemProps) {
   const statusMeta = getWorkerOrderStatusMeta(order.status);
   const StatusIcon = statusMeta.icon;
   const canSendOffer = order.status === 'pending';

   return (
      <article className="app-section-panel border-border/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5">
         <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
               <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                     <span
                        className={cn(
                           'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                           statusMeta.badgeClassName
                        )}
                     >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusMeta.label}
                     </span>
                     <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
                        رقم الطلب #{order.id}
                     </span>
                     <span className="rounded-full border border-primary/12 bg-primary/[0.05] px-3 py-1 text-xs font-medium text-primary">
                        {getWorkerOrderPriorityLabel(order.priority)}
                     </span>
                  </div>

                  <div>
                     <h2 className="text-lg font-semibold text-foreground">
                        {order.career.name}
                     </h2>
                     <p className="mt-1 line-clamp-2 text-sm leading-7 text-muted-foreground">
                        {order.description}
                     </p>
                  </div>
               </div>

               <div
                  className={cn(
                     'rounded-2xl border px-4 py-3 text-sm',
                     statusMeta.panelClassName
                  )}
               >
                  <p className="text-xs text-muted-foreground">حالة الطلب</p>
                  <p className="mt-1 font-semibold text-foreground">
                     {statusMeta.description}
                  </p>
               </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/[0.35] p-3 lg:grid-cols-4">
               <div className="flex items-center gap-2 text-sm">
                  <StatusIcon className="h-4 w-4 text-primary" />
                  <div>
                     <p className="text-xs text-muted-foreground">الحالة</p>
                     <p className="font-medium text-foreground">
                        {statusMeta.label}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-primary" />
                  <div>
                     <p className="text-xs text-muted-foreground">التخصص</p>
                     <p className="font-medium text-foreground">
                        {order.career.name}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                     <p className="text-xs text-muted-foreground">المنطقة</p>
                     <p className="font-medium text-foreground">
                        {order.address.area_address.name}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-2 text-sm">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <div>
                     <p className="text-xs text-muted-foreground">المهلة</p>
                     <p className="font-medium text-foreground">
                        {getWorkerOrderExpiryLabel(order.expires_at)}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
               <div className="flex flex-wrap gap-2">
                  {order.services.slice(0, 4).map((service) => (
                     <span
                        key={service.id}
                        className="rounded-full border border-primary/12 bg-primary/[0.05] px-3 py-1 text-xs font-medium text-primary"
                     >
                        {service.name}
                     </span>
                  ))}
                  {order.services.length > 4 ? (
                     <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        +{order.services.length - 4} خدمات
                     </span>
                  ) : null}
               </div>

               <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                     <Sparkles className="h-4 w-4" />
                     مطابقة {order.matched_services_count}/
                     {order.services_count}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                     <CalendarDays className="h-4 w-4" />
                     {formatWorkerOrderDate(order.scheduled_at)}
                  </span>
               </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                     {order.address.detailed_address}
                  </span>
               </div>

               <Button
                  size="sm"
                  disabled={!canSendOffer}
                  onClick={() => canSendOffer && onSendOffer(order.id)}
                  className="h-10 rounded-xl px-5 text-sm font-semibold"
               >
                  إرسال عرض سعر
               </Button>
            </div>
         </div>
      </article>
   );
}

export default WorkerOrderListItem;
