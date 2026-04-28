'use client';

import { ShieldCheck } from 'lucide-react';
import type { Control } from 'react-hook-form';

import { SectionPanel } from '@/components/ui/section-panel';
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadField } from '@/components/image-upload';
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
               name="images"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>إرفاق صور (اختياري)</FormLabel>
                     <FormControl>
                        <ImageUploadField
                           state={{
                              existingImages: [],
                              newFiles: (field.value as File[]) ?? [],
                              deletedIds: [],
                           }}
                           callbacks={{
                              onNewFilesAdd: (newFiles) => {
                                 field.onChange([
                                    ...((field.value as File[]) ?? []),
                                    ...newFiles,
                                 ]);
                              },
                              onNewFileRemove: (index) => {
                                 const current = (field.value as File[]) ?? [];
                                 field.onChange(
                                    current.filter((_, i) => i !== index)
                                 );
                              },
                              onExistingImageDelete: () => {},
                              onExistingImageRestore: () => {},
                           }}
                           config={{
                              imageBaseUrl: '',
                              uploadButtonText: 'اختيار صور',
                              uploadHintText:
                                 'اختر صوراً توضيحية للمشكلة أو مكان العمل',
                              emptyStateText: 'لم يتم اختيار صور بعد',
                           }}
                           isEditing={true}
                        />
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
