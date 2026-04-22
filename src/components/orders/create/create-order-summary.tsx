'use client';

import { SelectedServicesSidebar } from '@/components/orders/selected-services-sidebar';
import type { Service } from '@/types/admin/services';

interface CreateOrderSummaryProps {
   selectedServices: Service[];
   selectedCareerDisplayName: string;
   onClear: () => void;
}

export function CreateOrderSummary({
   selectedServices,
   selectedCareerDisplayName,
   onClear,
}: CreateOrderSummaryProps) {
   return (
      <div className="space-y-4">
         <SelectedServicesSidebar
            selectedServices={selectedServices}
            onClear={onClear}
         />

         <div className="rounded-xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">مراجعة سريعة</p>
            <p>التصنيف: {selectedCareerDisplayName}</p>
            <p>عدد الخدمات: {selectedServices.length}</p>
         </div>
      </div>
   );
}

export default CreateOrderSummary;
