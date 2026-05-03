'use client';

import { Loader2 } from 'lucide-react';
import { useAuthToken, useCustomerOrders } from '@/hooks';
import { AppModal } from '@/components/ui';
import { CustomerOrderDetailsModal } from './customer-order-details-modal';

interface CustomerOrderDetailsModalViewProps {
   orderId: number;
}

export function CustomerOrderDetailsModalView({
   orderId,
}: CustomerOrderDetailsModalViewProps) {
   useAuthToken();

   const { orders, isLoading } = useCustomerOrders();
   const order = orders.find((item) => item.id === orderId);

   if (isLoading) {
      return (
         <AppModal
            open
            title={`تفاصيل الطلب #${orderId}`}
            description="جاري تحميل بيانات الطلب..."
            size="lg"
            theme="customer"
            closeHref="/customer/orders"
            closeButtonText="إغلاق"
         >
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-sm">جاري تحميل تفاصيل الطلب...</p>
            </div>
         </AppModal>
      );
   }

   if (!order) {
      return (
         <AppModal
            open
            title={`الطلب #${orderId}`}
            description="تعذر العثور على بيانات هذا الطلب."
            size="lg"
            theme="customer"
            closeHref="/customer/orders"
            closeButtonText="العودة إلى الطلبات"
         >
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
               <p className="text-base font-semibold text-foreground">
                  الطلب غير متوفر حالياً
               </p>
               <p className="max-w-sm text-sm leading-7">
                  ربما تم حذف الطلب أو لم يعد متاحاً للعرض من هذه الصفحة.
               </p>
            </div>
         </AppModal>
      );
   }

   return <CustomerOrderDetailsModal order={order} open />;
}

export default CustomerOrderDetailsModalView;
