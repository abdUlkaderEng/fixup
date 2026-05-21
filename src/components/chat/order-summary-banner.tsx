import { Hash } from 'lucide-react';

interface OrderSummaryBannerProps {
   orderId: number;
   // Expand these props when order_id is wired to the conversation API
   // orderDescription?: string;
   // orderStatus?: string;
}

export function OrderSummaryBanner({ orderId }: OrderSummaryBannerProps) {
   return (
      <div className="mx-4 mt-2 flex items-center gap-2 rounded-2xl border border-secondary/20 bg-secondary/10 px-3 py-2.5 text-sm">
         <Hash className="h-4 w-4 shrink-0 text-secondary-foreground/70" />
         <span className="font-medium text-secondary-foreground">
            الطلب #{orderId}
         </span>
      </div>
   );
}
