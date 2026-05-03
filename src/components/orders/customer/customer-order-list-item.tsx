'use client';

import Link from 'next/link';
import { CalendarDays, ChevronLeft, MapPin, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerOrder } from '@/types/entities/order';
import {
   formatOrderDate,
   getCustomerOrderStatusMeta,
   getOrderAreaName,
   getOrderCareerName,
} from './order-utils';

interface CustomerOrderListItemProps {
   order: CustomerOrder;
}

export function CustomerOrderListItem({ order }: CustomerOrderListItemProps) {
   const statusMeta = getCustomerOrderStatusMeta(order.status);
   const StatusIcon = statusMeta.icon;

   return (
      <Link
         href={`/customer/orders/${order.id}`}
         className="group block focus-visible:outline-none"
      >
         <article className="app-section-panel border-border/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md focus-visible:border-primary/25 sm:p-5">
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                        <span className="text-xs text-muted-foreground">
                           رقم الطلب #{order.id}
                        </span>
                     </div>

                     <div>
                        <h2 className="text-lg font-semibold text-foreground">
                           {getOrderCareerName(order)}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm leading-7 text-muted-foreground">
                           {order.description}
                        </p>
                     </div>
                  </div>

                  <div className="inline-flex items-center gap-2 self-start rounded-xl border border-primary/10 bg-primary/[0.03] px-3 py-2 text-sm font-medium text-primary">
                     عرض التفاصيل
                     <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  </div>
               </div>

               <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/[0.35] p-3 sm:grid-cols-3">
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
                        <p className="text-xs text-muted-foreground">التصنيف</p>
                        <p className="font-medium text-foreground">
                           {getOrderCareerName(order)}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                     <MapPin className="h-4 w-4 text-primary" />
                     <div>
                        <p className="text-xs text-muted-foreground">المنطقة</p>
                        <p className="font-medium text-foreground">
                           {getOrderAreaName(order)}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                     {order.services.slice(0, 3).map((service) => (
                        <span
                           key={service.id}
                           className="rounded-full border border-primary/12 bg-primary/[0.05] px-3 py-1 text-xs font-medium text-primary"
                        >
                           {service.name}
                        </span>
                     ))}
                     {order.services.length > 3 ? (
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                           +{order.services.length - 3} خدمات
                        </span>
                     ) : null}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <CalendarDays className="h-4 w-4" />
                     <span>{formatOrderDate(order.created_at)}</span>
                  </div>
               </div>
            </div>
         </article>
      </Link>
   );
}

export default CustomerOrderListItem;
