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

         <section className="worker-dashboard-hero app-section-panel mb-6 overflow-hidden border-secondry/10">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-40 " />
            <div className="pointer-events-none absolute -top-14 right-8 h-36 w-36 rounded-full bg-foreground/12 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
               <div className="space-y-3 flex space-x-5">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/16 text-secondary shadow-sm backdrop-blur-sm">
                     <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        أهلاً، {firstName}
                     </h1>
                     <p className="mt-1 max-w-2xl text-sm leading-7 text-foreground/78 sm:text-base">
                        راجع الطلبات المناسبة لتخصصك، وابدأ بعرض أكثر وضوحاً
                        للعميل من نفس لوحة العمل.
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="rounded-2xl text-center border border-secondary/15 bg-secondary/10 px-4 py-3 text-foreground backdrop-blur-sm">
                     <p className="text-xs text-foreground/70">
                        طلبات تنتظر عرضك
                     </p>
                     <p className="mt-1 text-2xl font-bold">{pendingCount}</p>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
}

export default WorkerDashboardHeader;
