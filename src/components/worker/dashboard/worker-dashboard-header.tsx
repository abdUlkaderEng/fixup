'use client';

import { Wrench } from 'lucide-react';
import { AuthDashboardHero } from '@/components/AuthDashboard';
import { StatusBadge } from '@/components/ui';
import type { WorkerStatus } from '@/types/entities/worker';

interface WorkerDashboardHeaderProps {
   firstName: string;
   pendingCount: number;
   workerStatus?: WorkerStatus | null;
}

export function WorkerDashboardHeader({
   firstName,
   pendingCount,
   workerStatus,
}: WorkerDashboardHeaderProps) {
   const badgeConfig: Record<WorkerStatus, { label: string; variant: any }> = {
      waiting: { label: 'قيد الانتظار', variant: 'pending' },
      active: { label: 'نشط', variant: 'active' },
      blocked: { label: 'محظور', variant: 'error' },
   };

   const leadingBadge = workerStatus ? (
      <StatusBadge
         status={badgeConfig[workerStatus].variant}
         label={badgeConfig[workerStatus].label}
      />
   ) : undefined;

   return (
      <AuthDashboardHero
         theme="worker"
         backHref="/worker/profile"
         backLabel="الانتقال إلى الملف الشخصي"
         icon={<Wrench className="h-6 w-6" />}
         title={`أهلاً، ${firstName}`}
         description="راجع الطلبات المناسبة لتخصصك، وابدأ بعرض أكثر وضوحاً للعميل من نفس لوحة العمل."
         leadingBadge={leadingBadge}
         highlight={{
            label: 'طلبات تنتظر عرضك',
            value: pendingCount,
         }}
      />
   );
}

export default WorkerDashboardHeader;
