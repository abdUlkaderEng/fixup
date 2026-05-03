'use client';

import {
   AlertCircle,
   CheckCircle2,
   Clock3,
   Sparkles,
   type LucideIcon,
   XCircle,
} from 'lucide-react';
import type { OrderStatus, WorkerOrder } from '@/types/entities/order';

export interface WorkerOrderStatusMeta {
   label: string;
   description: string;
   icon: LucideIcon;
   badgeClassName: string;
   panelClassName: string;
}

export const workerOrderStatusMap: Record<OrderStatus, WorkerOrderStatusMeta> =
   {
      pending: {
         label: 'بانتظار عرض السعر',
         description: 'الطلب ما زال مفتوحاً ويمكنك إرسال عرضك للعميل الآن.',
         icon: Clock3,
         badgeClassName: 'border border-primary/20 bg-primary/10 text-primary',
         panelClassName: 'border-primary/12 bg-primary/[0.04]',
      },
      accepted: {
         label: 'تم قبوله',
         description: 'تم قبول الطلب ويجري تنفيذ الخدمة أو التنسيق بشأنها.',
         icon: CheckCircle2,
         badgeClassName:
            'border border-emerald-200 bg-emerald-50 text-emerald-700',
         panelClassName: 'border-emerald-200/80 bg-emerald-50/70',
      },
      completed: {
         label: 'مكتمل',
         description: 'اكتمل تنفيذ الخدمة بنجاح.',
         icon: Sparkles,
         badgeClassName: 'border border-sky-200 bg-sky-50 text-sky-700',
         panelClassName: 'border-sky-200/80 bg-sky-50/70',
      },
      cancelled: {
         label: 'ملغي',
         description: 'تم إغلاق الطلب أو إلغاؤه ولن يستقبل عروضاً جديدة.',
         icon: XCircle,
         badgeClassName: 'border border-rose-200 bg-rose-50 text-rose-700',
         panelClassName: 'border-rose-200/80 bg-rose-50/70',
      },
   };

export function getWorkerOrderStatusMeta(status: OrderStatus) {
   return (
      workerOrderStatusMap[status] ?? {
         label: 'غير معروف',
         description: 'تعذر تحديد حالة الطلب حالياً.',
         icon: AlertCircle,
         badgeClassName: 'border border-border bg-muted text-muted-foreground',
         panelClassName: 'border-border bg-muted/50',
      }
   );
}

export function formatWorkerOrderDate(value?: string) {
   if (!value) return 'غير محدد';

   return new Intl.DateTimeFormat('ar', {
      dateStyle: 'medium',
      timeStyle: 'short',
   }).format(new Date(value));
}

export function getWorkerOrderPriorityLabel(
   priority?: WorkerOrder['priority']
) {
   return priority === 'high' ? 'مستعجل' : 'عادي';
}

export function getWorkerOrderExpiryLabel(expiresAt: string) {
   const diffMs = new Date(expiresAt).getTime() - Date.now();

   if (diffMs <= 0) {
      return 'انتهت المهلة';
   }

   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
   const diffDays = Math.floor(diffHours / 24);

   if (diffDays > 0) {
      return `ينتهي خلال ${diffDays} يوم`;
   }

   const safeHours = Math.max(diffHours, 1);
   return `ينتهي خلال ${safeHours} ساعة`;
}
