'use client';

import {
   CheckCircle2,
   Clock3,
   ReceiptText,
   XCircle,
   type LucideIcon,
} from 'lucide-react';
import type { CustomerOrder } from '@/types/entities/order';

interface CustomerOrdersOverviewProps {
   orders: CustomerOrder[];
}

interface StatCard {
   label: string;
   value: number;
   icon: LucideIcon;
   iconClassName: string;
   backgroundClassName: string;
}

export function CustomerOrdersOverview({
   orders,
}: CustomerOrdersOverviewProps) {
   const stats: StatCard[] = [
      {
         label: 'إجمالي الطلبات',
         value: orders.length,
         icon: ReceiptText,
         iconClassName: 'text-primary',
         backgroundClassName: 'bg-primary/10',
      },
      {
         label: 'قيد الانتظار',
         value: orders.filter((order) => order.status === 'pending').length,
         icon: Clock3,
         iconClassName: 'text-primary',
         backgroundClassName: 'bg-primary/10',
      },
      {
         label: 'تم قبولها',
         value: orders.filter((order) => order.status === 'accepted').length,
         icon: CheckCircle2,
         iconClassName: 'text-primary',
         backgroundClassName: 'bg-primary/10',
      },
      {
         label: 'الملغاة',
         value: orders.filter((order) => order.status === 'cancelled').length,
         icon: XCircle,
         iconClassName: 'text-primary',
         backgroundClassName: 'bg-primary/10',
      },
   ];

   return (
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
         {stats.map((stat) => {
            const Icon = stat.icon;

            return (
               <div
                  key={stat.label}
                  className="app-section-panel border-border/60 p-4"
               >
                  <div className="flex items-center justify-between gap-3">
                     <div>
                        <p className="text-2xl font-bold text-foreground">
                           {stat.value}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                           {stat.label}
                        </p>
                     </div>

                     <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.backgroundClassName}`}
                     >
                        <Icon className={`h-5 w-5 ${stat.iconClassName}`} />
                     </div>
                  </div>
               </div>
            );
         })}
      </section>
   );
}

export default CustomerOrdersOverview;
