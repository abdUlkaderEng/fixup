'use client';

import { Sparkles } from 'lucide-react';

import { CareerSelect } from '@/components/publicComponents/career-select';
import { ServicesPicker } from '@/components/publicComponents/services-picker';
import { SectionPanel } from '@/components/ui/section-panel';

interface CreateOrderServicesSectionProps {
   selectedCareerId?: number;
   onCareerChange: (careerId: number) => void;
   selectedServiceIds: number[];
   onServicesChange: (serviceIds: number[]) => void;
}

export function CreateOrderServicesSection({
   selectedCareerId,
   onCareerChange,
   selectedServiceIds,
   onServicesChange,
}: CreateOrderServicesSectionProps) {
   return (
      <SectionPanel
         title="اختيار التصنيف والخدمات"
         icon={<Sparkles className="h-5 w-5" />}
      >
         <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
               <label className="mb-2 block text-sm font-medium">
                  التصنيف المهني
               </label>
               <CareerSelect
                  value={selectedCareerId}
                  onChange={(value) => onCareerChange(value ?? 0)}
                  placeholder="اختر التصنيف"
               />
            </div>
         </div>

         <ServicesPicker
            careerId={selectedCareerId}
            value={selectedServiceIds}
            onChange={onServicesChange}
         />
      </SectionPanel>
   );
}

export default CreateOrderServicesSection;
