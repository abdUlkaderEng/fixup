'use client';

import * as React from 'react';
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from '../ui/select';
import { usePublicAreas } from '@/hooks/public/use-public-areas';

export interface AreaSelectProps {
   value?: number | null;
   onChange?: (value: number | null) => void;
   disabled?: boolean;
   perPage?: number;
   className?: string;
   placeholder?: string;
}

export function AreaSelect({
   value,
   onChange,
   disabled,
   perPage = 100,
   className,
   placeholder,
}: AreaSelectProps) {
   const { areas, isLoading } = usePublicAreas({ perPage, autoFetch: true });

   const handleChange = (val: string) => {
      if (!onChange) return;
      if (!val || val === 'none') return onChange(null);
      const n = Number(val);
      onChange(Number.isNaN(n) ? null : n);
   };

   return (
      <Select
         value={value ? String(value) : 'none'}
         onValueChange={handleChange}
         disabled={disabled || isLoading}
      >
         <SelectTrigger className="w-full text-right" dir="rtl">
            <SelectValue
               placeholder={
                  placeholder ??
                  (isLoading ? 'جاري تحميل المناطق...' : 'اختر المنطقة')
               }
            />
         </SelectTrigger>
         <SelectContent>
            {isLoading ? (
               <SelectItem value="none" disabled>
                  جاري تحميل المناطق...
               </SelectItem>
            ) : areas.length === 0 ? (
               <SelectItem value="none" disabled>
                  لا توجد مناطق متاحة
               </SelectItem>
            ) : (
               areas.map((area) => (
                  <SelectItem key={area.id} value={String(area.id)}>
                     {area.area_name}
                  </SelectItem>
               ))
            )}
         </SelectContent>
      </Select>
   );
}

export default AreaSelect;
