'use client';

import * as React from 'react';
import { Loader2, Wrench } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { usePublicServices } from '@/hooks/public/use-public-services';

export interface ServicesPickerProps {
   careerId?: number | null;
   value: number[];
   onChange: (next: number[]) => void;
   disabled?: boolean;
   perPage?: number;
}

export function ServicesPicker({
   careerId,
   value,
   onChange,
   disabled,
   perPage = 100,
}: ServicesPickerProps) {
   const { services, isLoading } = usePublicServices({
      careerId: careerId || undefined,
      perPage,
   });

   if (!careerId) {
      return (
         <div className="rounded-xl border border-dashed border-muted-foreground/30 p-6 text-center">
            <Wrench className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
               اختر المجال المهني أولاً لعرض الخدمات المتاحة
            </p>
         </div>
      );
   }

   if (isLoading) {
      return (
         <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري تحميل الخدمات...
         </div>
      );
   }

   if (!services || services.length === 0) {
      return (
         <div className="rounded-xl border border-dashed border-muted-foreground/30 p-6 text-center">
            <Wrench className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
               لا توجد خدمات متاحة لهذا المجال
            </p>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
         {services.map((service) => {
            const isSelected = value.includes(service.id);

            return (
               <label
                  key={service.id}
                  className={cn(
                     'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                     isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40 hover:bg-muted/40'
                  )}
               >
                  <Checkbox
                     checked={isSelected}
                     onCheckedChange={(checked) => {
                        if (checked) {
                           onChange([...value, service.id]);
                           return;
                        }

                        onChange(value.filter((v) => v !== service.id));
                     }}
                     disabled={disabled}
                  />
                  <div className="space-y-1">
                     <p className="text-sm font-medium">{service.name}</p>
                     <p className="text-xs text-muted-foreground">
                        يمكنك اختيار أكثر من خدمة ضمن نفس التخصص.
                     </p>
                  </div>
               </label>
            );
         })}
      </div>
   );
}

export default ServicesPicker;
