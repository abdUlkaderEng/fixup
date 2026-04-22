'use client';

import { ListChecks, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Service } from '@/types/admin/services';

export interface SelectedServicesSidebarProps {
   selectedServices: Service[];
   onClear: () => void;
}

export function SelectedServicesSidebar({
   selectedServices,
   onClear,
}: SelectedServicesSidebarProps) {
   return (
      <Card className="sticky top-20 border-border/70 shadow-sm">
         <CardHeader className="space-y-1 border-b border-border/70 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
               <ListChecks className="h-5 w-5 text-primary" />
               الخدمات المختارة
            </CardTitle>
            <p className="text-sm text-muted-foreground">
               {selectedServices.length} خدمة مضافة في الطلب
            </p>
         </CardHeader>

         <CardContent className="space-y-4 p-4">
            {selectedServices.length === 0 ? (
               <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
                  لم يتم اختيار أي خدمة بعد.
               </div>
            ) : (
               <ul className="max-h-72 space-y-2 overflow-auto pr-1">
                  {selectedServices.map((service) => (
                     <li
                        key={service.id}
                        className="line-clamp-1 rounded-lg border border-border/70 bg-background px-3 py-2 text-sm text-foreground"
                     >
                        {service.name}
                     </li>
                  ))}
               </ul>
            )}

            <Button
               type="button"
               variant="outline"
               className="w-full"
               onClick={onClear}
               disabled={selectedServices.length === 0}
            >
               <Trash2 className="h-4 w-4" />
               مسح الاختيارات
            </Button>
         </CardContent>
      </Card>
   );
}

export default SelectedServicesSidebar;
