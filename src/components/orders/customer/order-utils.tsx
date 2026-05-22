'use client';

import {
   AlertCircle,
   CheckCircle2,
   Clock3,
   type LucideIcon,
   XCircle,
} from 'lucide-react';
import type { CustomerOrder, OrderStatus } from '@/types/entities/order';
import type { PublicCareer } from '@/types/public/careers';
import type { PublicArea } from '@/types/public/areas';

export interface CustomerOrderStatusMeta {
   label: string;
   description: string;
   icon: LucideIcon;
   badgeClassName: string;
   panelClassName: string;
}

export const customerOrderStatusMap: Record<
   OrderStatus,
   CustomerOrderStatusMeta
> = {
   pending: {
      label: 'قيد الانتظار',
      description: 'طلبك ما زال بانتظار التفاعل من الفنيين.',
      icon: Clock3,
      badgeClassName: 'border border-amber-200 bg-amber-50 text-amber-700',
      panelClassName: 'border-amber-200/80 bg-foreground/5',
   },
   accepted: {
      label: 'تم قبول الطلب',
      description: 'تمت متابعة الطلب ويجري تنسيقه مع الفني.',
      icon: CheckCircle2,
      badgeClassName:
         'border border-emerald-200 bg-emerald-50 text-emerald-700',
      panelClassName: 'border-emerald-200/80 bg-emerald-50/70',
   },
   completed: {
      label: 'مكتمل',
      description: 'اكتمل تنفيذ الخدمة ويمكنك إعادة الطلب متى شئت.',
      icon: CheckCircle2,
      badgeClassName: 'border border-sky-200 bg-sky-50 text-sky-700',
      panelClassName: 'border-sky-200/80 bg-sky-50/70',
   },
   cancelled: {
      label: 'ملغي',
      description: 'تم إلغاء الطلب ويمكنك إنشاء طلب جديد بديل.',
      icon: XCircle,
      badgeClassName: 'border border-rose-200 bg-rose-50 text-rose-700',
      panelClassName: 'border-rose-200/80 bg-rose-50/70',
   },
};

export function getCustomerOrderStatusMeta(status: OrderStatus) {
   return (
      customerOrderStatusMap[status] ?? {
         label: 'غير معروف',
         description: 'تعذر تحديد حالة الطلب حالياً.',
         icon: AlertCircle,
         badgeClassName: 'border border-border bg-muted text-muted-foreground',
         panelClassName: 'border-border bg-muted/50',
      }
   );
}

export function formatOrderDate(value?: string) {
   if (!value) return 'غير محدد';

   return new Intl.DateTimeFormat('ar', {
      dateStyle: 'medium',
      timeStyle: 'short',
   }).format(new Date(value));
}

export function getOrderAreaName(
   order: CustomerOrder,
   areas: PublicArea[] = []
) {
   const fromOrder = order.address.area_address?.name;
   if (fromOrder) return fromOrder;
   const match = areas.find(
      (area) => area.id === order.address.area_address_id
   );
   return match?.area_name ?? 'منطقة غير محددة';
}

export function getOrderCareerName(
   order: CustomerOrder,
   careers: PublicCareer[] = []
) {
   const fromOrder = order.career?.name;
   if (fromOrder) return fromOrder;
   const match = careers.find((career) => career.id === order.career_id);
   return match?.name ?? 'خدمة غير محددة';
}

export function getOrderPriorityLabel(priority?: number) {
   if (priority === 1) {
      return 'مستعجل';
   }

   return 'عادي';
}

export function getOrderPrimaryImage(order: CustomerOrder) {
   const firstImage = order.images[0];
   return firstImage?.url ?? firstImage?.path ?? null;
}
