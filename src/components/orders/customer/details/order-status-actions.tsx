'use client';

import Link from 'next/link';
import { Clock3, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CustomerOrder } from '@/types/entities/order';

export function OrderStatusActions({ order }: { order: CustomerOrder }) {
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
