'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
   BadgeDollarSign,
   CalendarDays,
   Clock3,
   Images,
   MapPinned,
   MessageCircle,
   RefreshCcw,
   Sparkles,
   Star,
   TimerOff,
   UserRound,
   Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionPanel } from '@/components/ui';
import { CustomerChatSheet } from '@/components/chat';
import type { CustomerOrder, OrderOffer } from '@/types/entities/order';
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

function OfferStatusBadge({ status }: { status: string }) {
   const map: Record<string, string> = {
      pending: 'قيد المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض',
   };
   const colorMap: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-rose-50 text-rose-700 border-rose-200',
   };
   return (
      <span
         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[status] ?? 'bg-muted text-muted-foreground border-border'}`}
      >
         {map[status] ?? status}
      </span>
   );
}

function ChatTrigger({ offer }: { offer: OrderOffer }) {
   const [open, setOpen] = useState(false);
   const [conversationId, setConversationId] = useState<number | undefined>(
      offer.conversation_id ?? undefined
   );
   return (
      <>
         <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
            className="gap-1.5"
         >
            <MessageCircle className="h-4 w-4" />
            تواصل
         </Button>
         <CustomerChatSheet
            open={open}
            onOpenChange={setOpen}
            workerId={offer.worker_id}
            conversationId={conversationId}
            onConversationCreated={setConversationId}
         />
      </>
   );
}

function OffersPanel({ offers }: { offers: OrderOffer[] }) {
   if (offers.length === 0) {
      return (
         <SectionPanel
            title="عروض الأسعار"
            icon={<BadgeDollarSign className="h-5 w-5" />}
            className="border-border/60"
         >
            <p className="py-4 text-center text-sm text-muted-foreground">
               لم يصل أي عرض سعر بعد
            </p>
         </SectionPanel>
      );
   }

   return (
      <SectionPanel
         title={`عروض الأسعار (${offers.length})`}
         icon={<BadgeDollarSign className="h-5 w-5" />}
         className="border-border/60"
      >
         <div className="space-y-3">
            {offers.map((offer) => (
               <div
                  key={offer.id}
                  className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
               >
                  <div className="space-y-1">
                     <p className="text-lg font-bold text-foreground">
                        {offer.price} ر.س
                     </p>
                     <p className="text-xs text-muted-foreground">
                        {offer.time_range}
                     </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                     <OfferStatusBadge status={offer.status} />
                     <p className="text-xs text-muted-foreground">
                        {formatOrderDate(offer.created_at)}
                     </p>
                     <ChatTrigger offer={offer} />
                  </div>
               </div>
            ))}
         </div>
      </SectionPanel>
   );
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
                     <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs text-muted-foreground">
                           تاريخ الإنشاء
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {formatOrderDate(order.created_at)}
                        </p>
                     </div>
                     <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur">
                        <p className="text-xs text-muted-foreground">
                           موعد الخدمة
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                           {formatOrderDate(order.scheduled_at)}
                        </p>
                     </div>
                     <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm backdrop-blur sm:col-span-2">
                        <div className="flex items-center gap-1.5">
                           <TimerOff className="h-3.5 w-3.5 text-muted-foreground" />
                           <p className="text-xs text-muted-foreground">
                              ينتهي الطلب في
                           </p>
                        </div>
                        <p className="mt-1 font-semibold text-foreground">
                           {formatOrderDate(order.expires_at)}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="rounded-3xl border border-border/70 bg-background/85 p-4 shadow-sm">
                  {imageUrl ? (
                     <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                        <Image
                           src={process.env.NEXT_PUBLIC_IMAGE_URL + imageUrl}
                           alt={`صورة توضيحية للطلب ${order.id}`}
                           fill
                           className="object-cover"
                           sizes="(max-width: 1024px) 100vw, 340px"
                        />
                     </div>
                  ) : (
                     <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-primary/5 text-primary">
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
            <div className="space-y-4">
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
                                 className="rounded-full border border-primary/12 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                              >
                                 {service.name}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </SectionPanel>

               {order.images.length > 1 && (
                  <SectionPanel
                     title={`الصور (${order.images.length})`}
                     icon={<Images className="h-5 w-5" />}
                     className="border-border/60"
                  >
                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {order.images.map((img, idx) => {
                           const src = img.url ?? img.path;
                           return src ? (
                              <div
                                 key={img.id}
                                 className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted"
                              >
                                 <Image
                                    src={src}
                                    alt={`صورة ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                 />
                              </div>
                           ) : null;
                        })}
                     </div>
                  </SectionPanel>
               )}

               <OffersPanel offers={order.offers} />
            </div>

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

                     <div className="flex items-start gap-3">
                        <UserRound className="h-4 w-4 text-primary" />
                        <div className="space-y-1">
                           <p className="font-medium text-foreground">الفني</p>
                           {order.worker ? (
                              <>
                                 <p className="text-muted-foreground">
                                    {order.worker.name}
                                 </p>
                                 {order.worker.phone && (
                                    <p className="text-xs text-muted-foreground">
                                       {order.worker.phone}
                                    </p>
                                 )}
                                 {order.worker.rating != null && (
                                    <p className="inline-flex items-center gap-1 text-xs text-amber-600">
                                       <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                       {order.worker.rating.toFixed(1)}
                                    </p>
                                 )}
                              </>
                           ) : (
                              <p className="text-muted-foreground">
                                 لم يتم تعيين فني بعد
                              </p>
                           )}
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
