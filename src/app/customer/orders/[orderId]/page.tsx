import { CustomerOrderDetailsView } from '@/components/orders/customer/customer-order-details-view';

interface CustomerOrderDetailsPageProps {
   params: Promise<{
      orderId: string;
   }>;
}

export default async function CustomerOrderDetailsPage({
   params,
}: CustomerOrderDetailsPageProps) {
   const { orderId } = await params;

   return <CustomerOrderDetailsView orderId={Number(orderId)} />;
}
