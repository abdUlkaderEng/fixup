'use client';

import { useSession } from 'next-auth/react';
import { ClipboardList, Star, TrendingUp, Inbox, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderCard } from '@/components/worker/order-card';
import { useWorkerOrders } from '@/hooks/worker';

// ── Stat card config ──────────────────────────────────────────────────────────

const STAT_CARDS = [
   {
      label: 'الطلبات الجديدة',
      icon: Inbox,
      colorClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
      getValue: (pendingCount: number) => String(pendingCount),
   },
   {
      label: 'المهام النشطة',
      icon: ClipboardList,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      getValue: (_: number, acceptedCount: number) => String(acceptedCount),
   },
   {
      label: 'تقييمك',
      icon: Star,
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-400/10',
      getValue: () => '—',
   },
   {
      label: 'الأداء',
      icon: TrendingUp,
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
      getValue: () => '—',
   },
] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkerDashboardPage() {
   const { data: session } = useSession();
   const { orders, isLoading } = useWorkerOrders();

   const firstName = (session?.user?.name || 'الفني').split(' ')[0];

   const pendingCount = orders.filter((o) => o.status === 'pending').length;
   const acceptedCount = orders.filter((o) => o.status === 'accepted').length;

   const handleSendOffer = (orderId: number) => {
      // TODO: open price-offer modal
      console.log('Send offer for order', orderId);
   };

   return (
      <div className="space-y-8 max-w-7xl mx-auto">
         {/* Welcome Banner */}
         <section className="worker-welcome-banner relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div className="relative z-10">
               <p className="text-sm font-medium text-secondary/80 mb-1">
                  مرحباً بعودتك 👋
               </p>
               <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  أهلاً، {firstName}
               </h1>
               <p className="text-sm text-white/60 max-w-md leading-relaxed">
                  لديك طلبات جديدة تنتظر عروض الأسعار. راجعها وأرسل عروضك الآن.
               </p>
            </div>
            <div className="absolute -top-8 -left-8 h-40 w-40 rounded-full bg-secondary/8 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 left-1/3 h-28 w-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
         </section>

         {/* Stats */}
         <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAT_CARDS.map(
               ({ label, icon: Icon, colorClass, bgClass, getValue }) => (
                  <div
                     key={label}
                     className="worker-stat-card flex flex-col gap-2 rounded-2xl p-4 border border-border/60"
                  >
                     <div
                        className={cn(
                           'h-9 w-9 rounded-xl flex items-center justify-center',
                           bgClass
                        )}
                     >
                        <Icon className={cn('h-4 w-4', colorClass)} />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-foreground">
                           {getValue(pendingCount, acceptedCount)}
                        </p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                     </div>
                  </div>
               )
            )}
         </section>

         {/* Orders Grid */}
         <section className="space-y-4">
            <div>
               <h2 className="text-lg font-bold text-foreground">
                  الطلبات المتاحة
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  {!isLoading && orders.length > 0
                     ? `${orders.length} طلب في منطقتك`
                     : !isLoading
                       ? 'لا توجد طلبات حالياً'
                       : ''}
               </p>
            </div>

            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                  <p className="text-sm">جاري تحميل الطلبات...</p>
               </div>
            ) : orders.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center">
                     <Inbox className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div>
                     <p className="text-base font-semibold text-foreground">
                        لا توجد طلبات جديدة
                     </p>
                     <p className="text-sm text-muted-foreground mt-1">
                        ستظهر هنا الطلبات الجديدة في منطقتك
                     </p>
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {orders.map((order) => (
                     <OrderCard
                        key={order.id}
                        order={order}
                        onSendOffer={handleSendOffer}
                     />
                  ))}
               </div>
            )}
         </section>
      </div>
   );
}
