'use client';

import * as React from 'react';
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from '@/components/ui/select';
import { usePublicCareers } from '@/hooks/public/use-public-careers';

export interface CareerSelectProps {
   value?: number | null;
   onChange?: (value: number | null) => void;
   disabled?: boolean;
   perPage?: number;
   placeholder?: string;
}

export function CareerSelect({
   value,
   onChange,
   disabled,
   perPage = 100,
   placeholder,
}: CareerSelectProps) {
   const { careers, isLoading } = usePublicCareers();

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
         <SelectTrigger className="h-11 w-full text-right">
            <SelectValue
               placeholder={
                  placeholder ??
                  (isLoading ? 'جاري تحميل المجالات...' : 'اختر المجال المناسب')
               }
            />
         </SelectTrigger>
         <SelectContent>
            {isLoading ? (
               <SelectItem value="none" disabled>
                  جاري تحميل المجالات...
               </SelectItem>
            ) : careers.length === 0 ? (
               <SelectItem value="none" disabled>
                  لا توجد مجالات متاحة
               </SelectItem>
            ) : (
               careers.map((career) => (
                  <SelectItem key={career.id} value={String(career.id)}>
                     {career.name}
                  </SelectItem>
               ))
            )}
         </SelectContent>
      </Select>
   );
}

export default CareerSelect;
