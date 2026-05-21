'use client';

import {
   CalendarDays,
   Clock3,
   Flame,
   MessageCircle,
   Wallet,
} from 'lucide-react';
import {
   AuthDashboardMetaGrid,
   AuthDashboardMetaItem,
   AuthDashboardOrderCard,
} from '@/components/AuthDashboard';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type {
   WorkerOfferStatus,
   WorkerPendingOffer,
} from '@/types/worker/orders-workflow';

interface WorkerPendingOfferListItemProps {
   offer: WorkerPendingOffer;
   onOpenChat: (conversationId: number, orderId: number) => void;
}

const OFFER_STATUS_AR: Record<WorkerOfferStatus, string> = {
   pending: 'بانتظار رد العميل',
   accepted: 'تم قبول العرض',
   rejected: 'تم رفض العرض',
};

const OFFER_STATUS_STYLE: Record<WorkerOfferStatus, string> = {
   pending:
      'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
   accepted:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
   rejected:
      'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

export function WorkerPendingOfferListItem({
   offer,
   onOpenChat,
}: WorkerPendingOfferListItemProps) {
   const isHighPriority = (offer.order.priority ?? 0) > 0;

   return (
      <AuthDashboardOrderCard theme="worker">
         <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
               <span
                  className={cn(
                     'rounded-full border px-3 py-1 text-xs font-semibold',
                     OFFER_STATUS_STYLE[offer.status]
                  )}
               >
                  {OFFER_STATUS_AR[offer.status]}
               </span>
               {isHighPriority && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400">
                     <Flame className="h-3 w-3" />
                     أولوية عالية
                  </span>
               )}
               <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground">
                  عرض #{offer.id}
               </span>
            </div>

            <div>
               <h2 className="text-lg font-semibold text-foreground">
                  الطلب #{offer.order.id}
               </h2>
               <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  {offer.order.description}
               </p>
            </div>

            <AuthDashboardMetaGrid columnsClassName="lg:grid-cols-3">
               <AuthDashboardMetaItem
                  icon={<Wallet className="h-4 w-4" />}
                  label="السعر المرسل"
                  value={`${offer.price} ل.س`}
               />
               <AuthDashboardMetaItem
                  icon={<Clock3 className="h-4 w-4" />}
                  label="المدة"
                  value={offer.time_range}
               />
               <AuthDashboardMetaItem
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="موعد التنفيذ"
                  value={new Date(offer.order.scheduled_at).toLocaleDateString(
                     'ar-SA'
                  )}
               />
            </AuthDashboardMetaGrid>

            <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
               <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                     رقم الطلب:
                  </span>{' '}
                  #{offer.order_id}
               </p>
               <div className="flex flex-col items-stretch gap-1 sm:items-end">
                  <Button
                     size="sm"
                     className="h-10 rounded-xl px-5 text-sm font-semibold"
                     onClick={() =>
                        onOpenChat(offer.conversation_id, offer.order_id)
                     }
                     disabled={offer.conversation_id <= 0}
                  >
                     <MessageCircle className="mr-1 h-4 w-4" />
                     فتح المحادثة
                  </Button>
                  {offer.conversation_id <= 0 && (
                     <p className="text-[11px] text-muted-foreground">
                        ستفتح المحادثة عند رد العميل
                     </p>
                  )}
               </div>
            </div>
         </div>
      </AuthDashboardOrderCard>
   );
}
