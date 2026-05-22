'use client';

import Link from 'next/link';
import { CalendarDays, ChevronLeft, MapPin, Wrench, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
   AuthDashboardActionPill,
   AuthDashboardChip,
   AuthDashboardMetaGrid,
   AuthDashboardMetaItem,
   AuthDashboardOrderCard,
} from '@/components/AuthDashboard';
import type { CustomerOrder } from '@/types/entities/order';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';
import {
   formatOrderDate,
   getCustomerOrderStatusMeta,
   getOrderAreaName,
   getOrderCareerName,
} from './order-utils';

interface CustomerOrderListItemProps {
   order: CustomerOrder;
   careers?: PublicCareer[];
   areas?: PublicArea[];
}

export function CustomerOrderListItem({
   order,
   careers = [],
   areas = [],
}: CustomerOrderListItemProps) {
   const statusMeta = getCustomerOrderStatusMeta(order.status);
   const StatusIcon = statusMeta.icon;
   const careerName = getOrderCareerName(order, careers);
   const areaName = getOrderAreaName(order, areas);

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
                        {order.priority === 1 && (
                           <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                              <Zap className="h-3 w-3" />
                              مستعجل
                           </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                           رقم الطلب #{order.id}
                        </span>
                     </div>

                     <div>
                        <h2 className="text-lg font-semibold text-foreground">
                           {careerName}
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
                     icon={<Wrench className="h-4 w-4" />}
                     label="التصنيف"
                     value={careerName}
                  />
                  <AuthDashboardMetaItem
                     icon={<MapPin className="h-4 w-4" />}
                     label="المنطقة"
                     value={areaName}
                  />
                  <AuthDashboardMetaItem
                     icon={<CalendarDays className="h-4 w-4" />}
                     label="موعد الخدمة"
                     value={formatOrderDate(order.scheduled_at)}
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

                  <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                     <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        عدد العروض: {order.offers.length}
                     </span>
                     <span className="text-muted-foreground/60">
                        أُنشئ: {formatOrderDate(order.created_at)}
                     </span>
                  </div>
               </div>
            </div>
         </AuthDashboardOrderCard>
      </Link>
   );
}

export default CustomerOrderListItem;
