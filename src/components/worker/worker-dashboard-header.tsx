'use client';

import { Wrench } from 'lucide-react';
import { AuthDashboardHero } from '@/components/AuthDashboard';

interface WorkerDashboardHeaderProps {
   firstName: string;
   pendingCount: number;
}

export function WorkerDashboardHeader({
   firstName,
   pendingCount,
}: WorkerDashboardHeaderProps) {
   return (
      <AuthDashboardHero
         theme="worker"
         backHref="/worker/profile"
         backLabel="الانتقال إلى الملف الشخصي"
         icon={<Wrench className="h-6 w-6" />}
         title={`أهلاً، ${firstName}`}
         description="راجع الطلبات المناسبة لتخصصك، وابدأ بعرض أكثر وضوحاً للعميل من نفس لوحة العمل."
         highlight={{
            label: 'طلبات تنتظر عرضك',
            value: pendingCount,
         }}
      />
   );
}

export default WorkerDashboardHeader;
