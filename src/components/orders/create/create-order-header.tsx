'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CreateOrderHeaderProps {
   selectedCareerDisplayName: string;
}

export function CreateOrderHeader({
   selectedCareerDisplayName,
}: CreateOrderHeaderProps) {
   return (
      <>
         <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
         >
            <ArrowLeft className="h-4 w-4" />
            العودة للرئيسية
         </Link>

         <div className="app-section-panel mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                     إنشاء طلب خدمة
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                     اختر الخدمات المناسبة، ثم أكمل بيانات الطلب والموقع
                     لإرساله.
                  </p>
               </div>

               <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                  <p className="text-muted-foreground">التصنيف المختار</p>
                  <p className="font-semibold text-primary">
                     {selectedCareerDisplayName}
                  </p>
               </div>
            </div>
         </div>
      </>
   );
}

export default CreateOrderHeader;
