'use client';

import {
   CalendarDays,
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
import { MapPicker } from '@/components/map-picker';
import type { WorkerConfirmedOrder } from '@/types/worker/orders-workflow';

interface WorkerConfirmedOrderListItemProps {
   order: WorkerConfirmedOrder;
}

export function WorkerConfirmedOrderListItem({
   order,
}: WorkerConfirmedOrderListItemProps) {
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

   return (
      <AuthDashboardOrderCard theme="worker">
         <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
               <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  طلب مؤكد
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
                  label="حالة العرض"
                  value="مقبول"
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
         </div>
      </AuthDashboardOrderCard>
   );
}
