'use client';

import { AppModal } from '@/components/ui';
import type { CustomerOrder } from '@/types/entities/order';
import { CustomerOrderDetails } from './customer-order-details';
import { getCustomerOrderStatusMeta } from './order-utils';

interface CustomerOrderDetailsModalProps {
   order: CustomerOrder;
   open: boolean;
}

export function CustomerOrderDetailsModal({
   order,
   open,
}: CustomerOrderDetailsModalProps) {
   const statusMeta = getCustomerOrderStatusMeta(order.status);

   return (
      <AppModal
         open={open}
         title={`تفاصيل الطلب #${order.id}`}
         description={statusMeta.description}
         size="xl"
         theme="customer"
         closeHref="/customer/orders"
         closeButtonText="إغلاق"
         contentClassName="bg-white/70"
      >
         <CustomerOrderDetails order={order} />
      </AppModal>
   );
}

export default CustomerOrderDetailsModal;
