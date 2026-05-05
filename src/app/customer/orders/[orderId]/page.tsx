import { redirect } from 'next/navigation';

interface CustomerOrderDetailsPageProps {
   params: Promise<{
      orderId: string;
   }>;
}

export default async function CustomerOrderDetailsPage({
   params,
}: CustomerOrderDetailsPageProps) {
   const { orderId } = await params;

   redirect(`/customer/orders?order=${orderId}`);
}
