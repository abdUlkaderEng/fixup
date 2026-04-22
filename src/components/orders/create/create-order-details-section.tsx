'use client';

import { ImagePlus, ShieldCheck } from 'lucide-react';
import type { Control } from 'react-hook-form';

import { SectionPanel } from '@/components/ui/section-panel';
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CreateOrderFormValues } from '@/app/orders/create/schema';

interface CreateOrderDetailsSectionProps {
   control: Control<CreateOrderFormValues>;
}

export function CreateOrderDetailsSection({
   control,
}: CreateOrderDetailsSectionProps) {
   return (
      <SectionPanel
         title="تفاصيل الطلب"
         icon={<ShieldCheck className="h-5 w-5" />}
      >
         <div className="space-y-5">
            <FormField
               control={control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>وصف الطلب</FormLabel>
                     <FormControl>
                        <Textarea
                           {...field}
                           rows={5}
                           placeholder="اشرح المشكلة أو المطلوب تنفيذه بشكل واضح..."
                           className="resize-none"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={control}
               name="image"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>إرفاق صورة (اختياري)</FormLabel>
                     <FormControl>
                        <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4">
                           <label className="flex cursor-pointer items-center gap-3 text-sm">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                                 <ImagePlus className="h-5 w-5 text-muted-foreground" />
                              </span>
                              <span className="text-muted-foreground">
                                 اختر صورة توضيحية للمشكلة أو مكان العمل
                              </span>
                              <Input
                                 type="file"
                                 accept="image/*"
                                 className="hidden"
                                 onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    field.onChange(file);
                                 }}
                              />
                           </label>
                           {field.value instanceof File ? (
                              <p className="mt-2 text-xs text-muted-foreground">
                                 {field.value.name}
                              </p>
                           ) : null}
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
      </SectionPanel>
   );
}

export default CreateOrderDetailsSection;
