'use client';

import Link from 'next/link';
import { Plus, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDashboardHero } from '@/components/AuthDashboard';

export function CustomerOrdersHeader() {
   return (
      <AuthDashboardHero
         theme="customer"
         backHref="/customer/profile"
         backLabel="العودة إلى الملف الشخصي"
         icon={<ReceiptText className="h-6 w-6" />}
         title="طلباتي"
         description="راجع جميع الطلبات التي أنشأتها، وتابع حالتها، وادخل على التفاصيل الكاملة لكل طلب من نفس المكان."
         action={
            <Button
               asChild
               className="h-11 rounded-xl px-5 text-sm font-semibold"
            >
               <Link href="/customer/orders/create">
                  <Plus className="h-4 w-4" />
                  إنشاء طلب جديد
               </Link>
            </Button>
         }
      />
   );
}

export default CustomerOrdersHeader;
