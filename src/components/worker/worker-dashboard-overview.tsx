'use client';

import { BriefcaseBusiness, Clock3, ShieldCheck, Sparkles } from 'lucide-react';
import {
   AuthDashboardStatsGrid,
   type AuthDashboardStatItem,
} from '@/components/AuthDashboard';
import type { WorkerOrder } from '@/types/entities/order';

interface WorkerDashboardOverviewProps {
   orders: WorkerOrder[];
}

export function WorkerDashboardOverview({
   orders,
}: WorkerDashboardOverviewProps) {
   const stats: AuthDashboardStatItem[] = [
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

   return <AuthDashboardStatsGrid theme="worker" items={stats} />;
}

export default WorkerDashboardOverview;
