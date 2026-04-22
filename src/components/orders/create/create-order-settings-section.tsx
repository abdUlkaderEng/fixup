'use client';

import type { Control } from 'react-hook-form';

import { budgetTierOptions, priorityOptions } from '@/app/orders/create/schema';
import { RadioCardGroup } from '@/components/ui/radio-card-group';
import { SectionPanel } from '@/components/ui/section-panel';
import {
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import type { CreateOrderFormValues } from '@/app/orders/create/schema';

interface CreateOrderSettingsSectionProps {
   control: Control<CreateOrderFormValues>;
}

export function CreateOrderSettingsSection({
   control,
}: CreateOrderSettingsSectionProps) {
   return (
      <SectionPanel title="إعدادات الطلب">
         <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <FormField
               control={control}
               name="priority"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>أولوية الطلب</FormLabel>
                     <RadioCardGroup
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={priorityOptions}
                     />
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name="budgetTier"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>نوع الطلب</FormLabel>
                     <RadioCardGroup
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={budgetTierOptions}
                     />
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
      </SectionPanel>
   );
}

export default CreateOrderSettingsSection;
