'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomerOrdersHeader() {
   return (
      <>
         <Link
            href="/customer/profile"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
         >
            <ArrowLeft className="h-4 w-4" />
            العودة إلى الملف الشخصي
         </Link>

         <section className="app-section-panel mb-6 overflow-hidden border-primary/10 bg-gradient-to-l from-primary/[0.03] via-card to-card">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
               <div className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                     <ReceiptText className="h-6 w-6" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        طلباتي
                     </h1>
                     <p className="mt-1 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        راجع جميع الطلبات التي أنشأتها، وتابع حالتها، وادخل على
                        التفاصيل الكاملة لكل طلب من نفس المكان.
                     </p>
                  </div>
               </div>

               <Button
                  asChild
                  className="h-11 rounded-xl px-5 text-sm font-semibold"
               >
                  <Link href="/customer/orders/create">
                     <Plus className="h-4 w-4" />
                     إنشاء طلب جديد
                  </Link>
               </Button>
            </div>
         </section>
      </>
   );
}

export default CustomerOrdersHeader;
