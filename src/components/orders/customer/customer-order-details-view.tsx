'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2, TriangleAlert } from 'lucide-react';
import { useAuthToken, useCustomerOrders } from '@/hooks';
import { Button, EmptyState } from '@/components/ui';
import { CustomerOrderDetails } from './customer-order-details';

interface CustomerOrderDetailsViewProps {
   orderId: number;
}

export function CustomerOrderDetailsView({
   orderId,
}: CustomerOrderDetailsViewProps) {
   useAuthToken();

   const { orders, isLoading } = useCustomerOrders();
   const order = orders.find((item) => item.id === orderId);

   return (
      <div className="app-page-gradient app-page-spacing">
         <div className="container mx-auto px-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
               <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/customer/orders">
                     <ArrowLeft className="h-4 w-4" />
                     العودة إلى الطلبات
                  </Link>
               </Button>
            </div>

            {isLoading ? (
               <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">جاري تحميل تفاصيل الطلب...</p>
               </div>
            ) : order ? (
               <CustomerOrderDetails order={order} />
            ) : (
               <EmptyState
                  icon={<TriangleAlert className="h-10 w-10" />}
                  title="تعذر العثور على الطلب"
                  description="ربما تم حذف الطلب أو أن الرابط غير صحيح."
                  action={
                     <Button asChild>
                        <Link href="/customer/orders">العودة إلى الطلبات</Link>
                     </Button>
                  }
               />
            )}
         </div>
      </div>
   );
}

export default CustomerOrderDetailsView;
