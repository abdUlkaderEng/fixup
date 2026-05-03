import { CustomerOrderDetailsModalView } from '@/components/orders/customer/customer-order-details-modal-view';

interface CustomerOrderDetailsModalPageProps {
   params: Promise<{
      orderId: string;
   }>;
}

export default async function CustomerOrderDetailsModalPage({
   params,
}: CustomerOrderDetailsModalPageProps) {
   const { orderId } = await params;

   return <CustomerOrderDetailsModalView orderId={Number(orderId)} />;
}
