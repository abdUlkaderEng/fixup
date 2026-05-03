'use client';

import { CheckCircle2, Clock3, ReceiptText, XCircle } from 'lucide-react';
import {
   AuthDashboardStatsGrid,
   type AuthDashboardStatItem,
} from '@/components/AuthDashboard';
import type { CustomerOrder } from '@/types/entities/order';

interface CustomerOrdersOverviewProps {
   orders: CustomerOrder[];
}

export function CustomerOrdersOverview({
   orders,
}: CustomerOrdersOverviewProps) {
   const stats: AuthDashboardStatItem[] = [
      {
         label: 'إجمالي الطلبات',
         value: orders.length,
         icon: ReceiptText,
      },
      {
         label: 'قيد الانتظار',
         value: orders.filter((order) => order.status === 'pending').length,
         icon: Clock3,
      },
      {
         label: 'تم قبولها',
         value: orders.filter((order) => order.status === 'accepted').length,
         icon: CheckCircle2,
      },
      {
         label: 'الملغاة',
         value: orders.filter((order) => order.status === 'cancelled').length,
         icon: XCircle,
      },
   ];

   return <AuthDashboardStatsGrid theme="customer" items={stats} />;
}

export default CustomerOrdersOverview;
