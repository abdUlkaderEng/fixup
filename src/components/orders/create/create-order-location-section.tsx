'use client';

import { MapPin, TriangleAlert } from 'lucide-react';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { MapPicker } from '@/components/map-picker';
import { SectionPanel } from '@/components/ui/section-panel';
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import type { CreateOrderFormValues } from '@/app/orders/create/schema';
import type { PublicArea } from '@/types/public';

interface CreateOrderLocationSectionProps {
   control: Control<CreateOrderFormValues>;
   setValue: UseFormSetValue<CreateOrderFormValues>;
   areas: PublicArea[];
   isLoadingAreas: boolean;
   mapTilerKey?: string;
   hasMapSelection: boolean;
   onMapSelectionChange: (selected: boolean) => void;
}

export function CreateOrderLocationSection({
   control,
   setValue,
   areas,
   isLoadingAreas,
   mapTilerKey,
   hasMapSelection,
   onMapSelectionChange,
}: CreateOrderLocationSectionProps) {
   return (
      <SectionPanel
         title="موقع تنفيذ الطلب"
         icon={<MapPin className="h-5 w-5" />}
      >
         <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <FormField
                  control={control}
                  name="areaAddressId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>المنطقة</FormLabel>
                        <Select
                           value={field.value ? String(field.value) : undefined}
                           onValueChange={(value) =>
                              field.onChange(Number(value))
                           }
                           disabled={isLoadingAreas}
                        >
                           <SelectTrigger>
                              <SelectValue
                                 placeholder={
                                    isLoadingAreas
                                       ? 'جاري تحميل المناطق...'
                                       : 'اختر المنطقة'
                                 }
                              />
                           </SelectTrigger>
                           <SelectContent>
                              {areas.map((area) => (
                                 <SelectItem
                                    key={area.id}
                                    value={String(area.id)}
                                 >
                                    {area.area_name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={control}
                  name="detailedAddress"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>العنوان التفصيلي</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="مثال: المزة، قرب حديقة الجلاء، بناء رقم 12"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            {mapTilerKey ? (
               <MapPicker
                  mapTilerKey={mapTilerKey}
                  onLocationSelect={(lng, lat) => {
                     onMapSelectionChange(true);
                     setValue('longitude', lng, { shouldValidate: true });
                     setValue('latitude', lat, { shouldValidate: true });
                  }}
               />
            ) : (
               <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                  لا يمكن عرض الخريطة حالياً لأن مفتاح MapTiler غير مضبوط في
                  البيئة.
               </div>
            )}

            {!hasMapSelection ? (
               <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <TriangleAlert className="h-4 w-4" />
                  يرجى اختيار موقعك من الخريطة.
               </div>
            ) : null}
         </div>
      </SectionPanel>
   );
}

export default CreateOrderLocationSection;
