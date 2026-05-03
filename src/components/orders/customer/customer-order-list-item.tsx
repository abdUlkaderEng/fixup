'use client';

import Link from 'next/link';
import { CalendarDays, ChevronLeft, MapPin, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
   AuthDashboardActionPill,
   AuthDashboardChip,
   AuthDashboardMetaGrid,
   AuthDashboardMetaItem,
   AuthDashboardOrderCard,
} from '@/components/AuthDashboard';
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
         <AuthDashboardOrderCard
            theme="customer"
            className="focus-visible:border-primary/25"
         >
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

                  <AuthDashboardActionPill>
                     عرض التفاصيل
                     <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  </AuthDashboardActionPill>
               </div>

               <AuthDashboardMetaGrid>
                  <AuthDashboardMetaItem
                     icon={<StatusIcon className="h-4 w-4" />}
                     label="الحالة"
                     value={statusMeta.label}
                  />
                  <AuthDashboardMetaItem
                     icon={<Wrench className="h-4 w-4" />}
                     label="التصنيف"
                     value={getOrderCareerName(order)}
                  />
                  <AuthDashboardMetaItem
                     icon={<MapPin className="h-4 w-4" />}
                     label="المنطقة"
                     value={getOrderAreaName(order)}
                  />
               </AuthDashboardMetaGrid>

               <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                     {order.services.slice(0, 3).map((service) => (
                        <AuthDashboardChip key={service.id}>
                           {service.name}
                        </AuthDashboardChip>
                     ))}
                     {order.services.length > 3 ? (
                        <AuthDashboardChip tone="neutral">
                           +{order.services.length - 3} خدمات
                        </AuthDashboardChip>
                     ) : null}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                     <CalendarDays className="h-4 w-4" />
                     <span>{formatOrderDate(order.created_at)}</span>
                  </div>
               </div>
            </div>
         </AuthDashboardOrderCard>
      </Link>
   );
}

export default CustomerOrderListItem;
