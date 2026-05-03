'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
   CalendarDays,
   Clock3,
   MapPinned,
   RefreshCcw,
   Sparkles,
   UserRound,
   Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionPanel } from '@/components/ui';
import type { CustomerOrder } from '@/types/entities/order';
import {
   formatOrderDate,
   getCustomerOrderStatusMeta,
   getOrderAreaName,
   getOrderCareerName,
   getOrderPrimaryImage,
   getOrderPriorityLabel,
} from './order-utils';

interface CustomerOrderDetailsProps {
   order: CustomerOrder;
}

function OrderStatusActions({ order }: { order: CustomerOrder }) {
   const mapHref =
      order.address.latitude && order.address.longitude
         ? `https://www.google.com/maps?q=${order.address.latitude},${order.address.longitude}`
         : null;

   if (order.status === 'accepted' && mapHref) {
      return (
         <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="h-11 rounded-xl">
               <Link href="/customer/orders/create">إنشاء طلب آخر</Link>
            </Button>
            <Button asChild className="h-11 rounded-xl">
               <a href={mapHref} target="_blank" rel="noreferrer">
                  عرض الموقع على الخريطة
               </a>
            </Button>
         </div>
      );
   }

   if (order.status === 'completed' || order.status === 'cancelled') {
      return (
         <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" className="h-11 rounded-xl">
               <Link href="/customer/orders">العودة إلى الطلبات</Link>
            </Button>
            <Button asChild className="h-11 rounded-xl">
               <Link href="/customer/orders/create">
                  <RefreshCcw className="h-4 w-4" />
                  إنشاء طلب مشابه
               </Link>
            </Button>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
         <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link href="/customer/orders/create">تعديل طلب جديد</Link>
         </Button>
         <Button disabled className="h-11 rounded-xl">
            <Clock3 className="h-4 w-4" />
            بانتظار تحديث الحالة
         </Button>
      </div>
   );
}

export function CustomerOrderDetails({ order }: CustomerOrderDetailsProps) {
   const statusMeta = getCustomerOrderStatusMeta(order.status);
   const StatusIcon = statusMeta.icon;
   const imageUrl = getOrderPrimaryImage(order);

   return (
      <div className="space-y-4">
         <section
            className={`overflow-hidden rounded-3xl border ${statusMeta.panelClassName}`}
         >
            <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)] lg:p-6">
               <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                     <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
                     >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusMeta.label}
                     </span>
                     <span className="text-xs text-muted-foreground">
                        رقم الطلب #{order.id}
                     </span>
                  </div>

                  <div>
                     <h2 className="text-2xl font-bold text-foreground">
                        {getOrderCareerName(order)}
                     </h2>
                     <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {statusMeta.description}
                     </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                     <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs text-muted-foreground">
                           تاريخ الإنشاء
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {formatOrderDate(order.created_at)}
                        </p>
                     </div>
                     <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs text-muted-foreground">
                           موعد الخدمة
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {formatOrderDate(order.scheduled_at)}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm">
                  {imageUrl ? (
                     <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Image
                           src={imageUrl}
                           alt={`صورة توضيحية للطلب ${order.id}`}
                           fill
                           className="object-cover"
                           sizes="(max-width: 1024px) 100vw, 340px"
                        />
                     </div>
                  ) : (
                     <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary/[0.05] text-primary">
                        <Sparkles className="h-10 w-10" />
                     </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                     <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">
                           الأولوية
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {getOrderPriorityLabel(order.priority)}
                        </p>
                     </div>
                     <div className="rounded-2xl bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">
                           عدد الخدمات
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {order.services.length}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.85fr)]">
            <SectionPanel
               title="تفاصيل الطلب"
               icon={<Wrench className="h-5 w-5" />}
               className="border-border/60"
            >
               <div className="space-y-5">
                  <div>
                     <p className="text-sm font-medium text-foreground">
                        الوصف
                     </p>
                     <p className="mt-2 whitespace-pre-wrap text-sm leading-8 text-muted-foreground">
                        {order.description}
                     </p>
                  </div>

                  <div>
                     <p className="text-sm font-medium text-foreground">
                        الخدمات المطلوبة
                     </p>
                     <div className="mt-3 flex flex-wrap gap-2">
                        {order.services.map((service) => (
                           <span
                              key={service.id}
                              className="rounded-full border border-primary/12 bg-primary/[0.05] px-3 py-1 text-xs font-medium text-primary"
                           >
                              {service.name}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </SectionPanel>

            <div className="space-y-4">
               <SectionPanel
                  title="بيانات التنفيذ"
                  icon={<CalendarDays className="h-5 w-5" />}
                  className="border-border/60"
               >
                  <div className="space-y-4 text-sm">
                     <div className="flex items-start gap-3">
                        <MapPinned className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium text-foreground">
                              {getOrderAreaName(order)}
                           </p>
                           <p className="mt-1 leading-7 text-muted-foreground">
                              {order.address.detailed_address ||
                                 'لا يوجد وصف إضافي للموقع'}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <Clock3 className="h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium text-foreground">
                              آخر تحديث
                           </p>
                           <p className="text-muted-foreground">
                              {formatOrderDate(order.updated_at)}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <UserRound className="h-4 w-4 text-primary" />
                        <div>
                           <p className="font-medium text-foreground">الفني</p>
                           <p className="text-muted-foreground">
                              {order.worker?.name ?? 'لم يتم تعيين فني بعد'}
                           </p>
                        </div>
                     </div>
                  </div>
               </SectionPanel>

               <SectionPanel
                  title="الإجراءات"
                  icon={<RefreshCcw className="h-5 w-5" />}
                  className="border-border/60"
               >
                  <OrderStatusActions order={order} />
               </SectionPanel>
            </div>
         </div>
      </div>
   );
}

export default CustomerOrderDetails;
