'use client';

import { useState } from 'react';
import {
   CalendarDays,
   CheckCircle2,
   Clock3,
   Loader2,
   Mail,
   MapPin,
   Phone,
   ShieldCheck,
   User,
   Wallet,
} from 'lucide-react';
import {
   AuthDashboardMetaGrid,
   AuthDashboardMetaItem,
   AuthDashboardOrderCard,
} from '@/components/AuthDashboard';
import { MapPicker } from '@/components/map/map-picker';
import { Button } from '@/components/ui/button';
import { useWorkerRequestCompletion } from '@/hooks/worker';
import type { WorkerConfirmedOrder } from '@/types/worker/orders-workflow';
import type { OrderStatus } from '@/types/entities';

interface WorkerConfirmedOrderListItemProps {
   order: WorkerConfirmedOrder;
}

const ORDER_STATUS_BADGES: Record<
   Extract<OrderStatus, 'accepted' | 'completion_requested' | 'completed'>,
   {
      label: string;
      className: string;
   }
> = {
   accepted: {
      label: 'طلب مؤكد',
      className:
         'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
   },
   completion_requested: {
      label: 'بانتظار تأكيد العميل',
      className:
         'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
   },
   completed: {
      label: 'طلب مكتمل',
      className:
         'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400',
   },
};

function getOrderStatusBadge(status: OrderStatus) {
   if (
      status === 'accepted' ||
      status === 'completion_requested' ||
      status === 'completed'
   ) {
      return ORDER_STATUS_BADGES[status];
   }

   return ORDER_STATUS_BADGES.accepted;
}

export function WorkerConfirmedOrderListItem({
   order,
}: WorkerConfirmedOrderListItemProps) {
   const [completionRequestedLocally, setCompletionRequestedLocally] =
      useState(false);
   const { requestCompletion, isRequestingCompletion } =
      useWorkerRequestCompletion({
         onSuccess: (orderId) => {
            if (orderId === order.order.id) {
               setCompletionRequestedLocally(true);
            }
         },
      });

   const lat = Number(order.order.latitude);
   const lng = Number(order.order.longitude);
   const hasValidCoords =
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180 &&
      !(lat === 0 && lng === 0);
   const googleMapsHref = hasValidCoords
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : '#';
   const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
   const localStatus =
      completionRequestedLocally && order.order.status === 'accepted'
         ? 'completion_requested'
         : order.order.status;
   const statusBadge = getOrderStatusBadge(localStatus);

   const handleRequestCompletion = async () => {
      try {
         await requestCompletion(order.order.id);
      } catch {
         // Error toast is handled by the hook.
      }
   };

   return (
      <AuthDashboardOrderCard theme="worker">
         <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
               <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.className}`}
               >
                  {statusBadge.label}
               </span>
               <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
                  الطلب #{order.order.id}
               </span>
            </div>

            <div>
               <h2 className="text-lg font-semibold text-foreground">
                  {order.order.description}
               </h2>
               <p className="mt-1 text-sm text-muted-foreground">
                  {order.order.detailed_address}
               </p>
            </div>

            <AuthDashboardMetaGrid columnsClassName="lg:grid-cols-4">
               <AuthDashboardMetaItem
                  icon={<Wallet className="h-4 w-4" />}
                  label="السعر المتفق عليه"
                  value={`${order.agreed_price} ل.س`}
               />
               <AuthDashboardMetaItem
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="حالة الطلب"
                  value={statusBadge.label}
               />
               <AuthDashboardMetaItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="موعد التنفيذ"
                  value={new Date(order.order.scheduled_at).toLocaleDateString(
                     'ar-SA'
                  )}
               />
               <AuthDashboardMetaItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="المدة"
                  value={order.time_range}
               />
            </AuthDashboardMetaGrid>

            <AuthDashboardMetaGrid columnsClassName="sm:grid-cols-2">
               <AuthDashboardMetaItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="المنطقة"
                  value={order.order.area_name}
               />
               <AuthDashboardMetaItem
                  icon={<MapPin className="h-4 w-4" />}
                  label="العنوان التفصيلي"
                  value={order.order.detailed_address}
               />
            </AuthDashboardMetaGrid>

            {hasValidCoords ? (
               <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3">
                  {mapTilerKey ? (
                     <MapPicker
                        mapTilerKey={mapTilerKey}
                        initialLng={lng}
                        initialLat={lat}
                        readOnly
                        className="rounded-xl border border-border/60 p-2 h-75"
                     />
                  ) : null}
                  <a
                     href={googleMapsHref}
                     target="_blank"
                     rel="noreferrer"
                     className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                     <MapPin className="h-4 w-4" />
                     فتح الموقع في Google Maps
                  </a>
               </div>
            ) : null}

            <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/35 p-3 sm:grid-cols-3">
               <AuthDashboardMetaItem
                  icon={<User className="h-4 w-4" />}
                  label="اسم العميل"
                  value={order.customer.name}
               />
               <AuthDashboardMetaItem
                  icon={<Phone className="h-4 w-4" />}
                  label="رقم الهاتف"
                  value={order.customer.phone}
               />
               <AuthDashboardMetaItem
                  icon={<Mail className="h-4 w-4" />}
                  label="البريد الإلكتروني"
                  value={order.customer.email}
               />
            </div>

            {localStatus === 'accepted' && (
               <div className="flex flex-col gap-3 rounded-2xl border border-secondary/25 bg-secondary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                     <p className="text-sm font-semibold text-foreground">
                        هل انتهيت من تنفيذ الخدمة؟
                     </p>
                     <p className="mt-1 text-xs text-muted-foreground">
                        أرسل طلب الإكمال للعميل ليقوم بتأكيد انتهاء الطلب.
                     </p>
                  </div>
                  <Button
                     type="button"
                     variant="secondary"
                     size="lg"
                     onClick={handleRequestCompletion}
                     disabled={isRequestingCompletion}
                     className="w-full gap-2 sm:w-auto"
                  >
                     {isRequestingCompletion ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <CheckCircle2 className="h-4 w-4" />
                     )}
                     طلب إكمال الطلب
                  </Button>
               </div>
            )}

            {localStatus === 'completion_requested' && (
               <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                     <p className="text-sm font-semibold">
                        تم إرسال طلب الإكمال
                     </p>
                     <p className="mt-1 text-xs">
                        سيبقى الطلب هنا حتى يؤكد العميل اكتمال الخدمة.
                     </p>
                  </div>
               </div>
            )}

            {localStatus === 'completed' && (
               <div className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                     <p className="text-sm font-semibold">تم إكمال الطلب</p>
                     <p className="mt-1 text-xs">
                        أكد العميل اكتمال الخدمة بنجاح.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </AuthDashboardOrderCard>
   );
}
