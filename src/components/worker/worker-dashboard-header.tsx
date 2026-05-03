'use client';

import Link from 'next/link';
import { ArrowLeft, BellRing, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui';

interface WorkerDashboardHeaderProps {
   firstName: string;
   pendingCount: number;
}

export function WorkerDashboardHeader({
   firstName,
   pendingCount,
}: WorkerDashboardHeaderProps) {
   return (
      <>
         <Link
            href="/worker/profile"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
         >
            <ArrowLeft className="h-4 w-4" />
            الانتقال إلى الملف الشخصي
         </Link>

         <section className="worker-dashboard-hero app-section-panel mb-6 overflow-hidden border-primary/10">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
            <div className="pointer-events-none absolute -top-14 right-8 h-36 w-36 rounded-full bg-white/12 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
               <div className="space-y-3 flex space-x-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-white shadow-sm backdrop-blur-sm">
                     <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-white sm:text-3xl">
                        أهلاً، {firstName}
                     </h1>
                     <p className="mt-1 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                        راجع الطلبات المناسبة لتخصصك، وابدأ بعرض أكثر وضوحاً
                        للعميل من نفس لوحة العمل.
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="rounded-2xl text-center border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
                     <p className="text-xs text-white/70">طلبات تنتظر عرضك</p>
                     <p className="mt-1 text-2xl font-bold">{pendingCount}</p>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}

export default WorkerDashboardHeader;
