'use client';

import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction } from 'react';
interface Props {
   filters: {
      budget: number;
      rating: number;
   };
   setFilters: Dispatch<
      SetStateAction<{
         budget: number;
         rating: number;
      }>
   >;
}
export default function FiltersSidebar({ filters, setFilters }: Props) {
   return (
      <aside className="w-64 p-4 border-r bg-background">
         <div className="space-y-6">
            <div>
               <Label className="text-lg font-semibold">الميزانية</Label>
               <Slider
                  defaultValue={[filters.budget]}
                  max={500000}
                  step={5000}
                  onValueChange={(v) =>
                     setFilters((prev) => ({ ...prev, budget: v[0] }))
                  }
               />
            </div>

            <div>
               <Label className="text-lg font-semibold">التقييم</Label>
               <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                     <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                           checked={filters.rating === rating}
                           onCheckedChange={() =>
                              setFilters((prev) => ({ ...prev, rating }))
                           }
                        />
                        <span>{rating} نجوم</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </aside>
   );
}
