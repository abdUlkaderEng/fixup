'use client';

import { CalendarDays, Clock3, MessageCircle, Wallet } from 'lucide-react';
import {
   AuthDashboardMetaGrid,
   AuthDashboardMetaItem,
   AuthDashboardOrderCard,
} from '@/components/AuthDashboard';
import { Button } from '@/components/ui';
import type { WorkerPendingOffer } from '@/types/worker/orders-workflow';

interface WorkerPendingOfferListItemProps {
   offer: WorkerPendingOffer;
   onOpenChat: (conversationId: number, orderId: number) => void;
}

export function WorkerPendingOfferListItem({
   offer,
   onOpenChat,
}: WorkerPendingOfferListItemProps) {
   return (
      <AuthDashboardOrderCard theme="worker">
         <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
               <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  بانتظار رد العميل
               </span>
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

            <AuthDashboardMetaGrid columnsClassName="lg:grid-cols-4">
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
                  icon={<Clock3 className="h-4 w-4" />}
                  label="حالة الطلب"
                  value={offer.order.status}
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
