'use client';

import {
   BriefcaseBusiness,
   Clock3,
   ShieldCheck,
   Sparkles,
   type LucideIcon,
} from 'lucide-react';
import type { WorkerOrder } from '@/types/entities/order';

interface WorkerDashboardOverviewProps {
   orders: WorkerOrder[];
}

interface StatCard {
   label: string;
   value: number;
   icon: LucideIcon;
}

export function WorkerDashboardOverview({
   orders,
}: WorkerDashboardOverviewProps) {
   const stats: StatCard[] = [
      {
         label: 'إجمالي الطلبات المتاحة',
         value: orders.length,
         icon: BriefcaseBusiness,
      },
      {
         label: 'بانتظار العروض',
         value: orders.filter((order) => order.status === 'pending').length,
         icon: Clock3,
      },
      {
         label: 'طلبات مستعجلة',
         value: orders.filter((order) => order.priority === 'high').length,
         icon: Sparkles,
      },
      {
         label: 'مطابقة لتخصصك',
         value: orders.filter(
            (order) => order.matched_services_count === order.services_count
         ).length,
         icon: ShieldCheck,
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

                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                     </div>
                  </div>
               </div>
            );
         })}
      </section>
   );
}

export default WorkerDashboardOverview;
