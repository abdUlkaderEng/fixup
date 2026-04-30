'use client';

import type { Control } from 'react-hook-form';

import { priorityOptions } from '@/app/orders/create/schema';
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
      </SectionPanel>
   );
}

export default CreateOrderSettingsSection;
