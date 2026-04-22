'use client';

import { Sparkles } from 'lucide-react';

import { ServicesGridSelector } from '@/components/orders/services-grid-selector';
import { SectionPanel } from '@/components/ui/section-panel';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import type { Service } from '@/types/admin/services';
import type { PublicCareer } from '@/types/public';

interface CreateOrderServicesSectionProps {
   careers: PublicCareer[];
   selectedCareerId?: number;
   onCareerChange: (careerId: number) => void;
   isLoadingCareers: boolean;
   services: Service[];
   selectedServiceIds: number[];
   onToggleService: (serviceId: number) => void;
   isLoadingServices: boolean;
}

export function CreateOrderServicesSection({
   careers,
   selectedCareerId,
   onCareerChange,
   isLoadingCareers,
   services,
   selectedServiceIds,
   onToggleService,
   isLoadingServices,
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
               <Select
                  value={
                     selectedCareerId ? String(selectedCareerId) : undefined
                  }
                  onValueChange={(value) => onCareerChange(Number(value))}
                  disabled={isLoadingCareers}
               >
                  <SelectTrigger>
                     <SelectValue
                        placeholder={
                           isLoadingCareers
                              ? 'جاري تحميل التصنيفات...'
                              : 'اختر التصنيف'
                        }
                     />
                  </SelectTrigger>
                  <SelectContent>
                     {careers.map((career) => (
                        <SelectItem key={career.id} value={String(career.id)}>
                           {career.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         {!selectedCareerId ? (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
               يرجى اختيار تصنيف مهني لعرض الخدمات.
            </div>
         ) : (
            <ServicesGridSelector
               services={services}
               selectedServiceIds={selectedServiceIds}
               isLoading={isLoadingServices}
               onToggle={onToggleService}
            />
         )}
      </SectionPanel>
   );
}

export default CreateOrderServicesSection;
