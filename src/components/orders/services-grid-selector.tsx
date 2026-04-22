'use client';

import { CheckCircle2, Wrench } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/admin/services';

export interface ServicesGridSelectorProps {
   services: Service[];
   selectedServiceIds: number[];
   onToggle: (serviceId: number) => void;
   isLoading?: boolean;
}

export function ServicesGridSelector({
   services,
   selectedServiceIds,
   onToggle,
   isLoading = false,
}: ServicesGridSelectorProps) {
   if (isLoading) {
      return (
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
               <Card
                  key={index}
                  className="overflow-hidden border border-border/60"
               >
                  <CardContent className="space-y-3 p-4">
                     <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                     <div className="h-4 w-full animate-pulse rounded bg-muted" />
                     <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </CardContent>
               </Card>
            ))}
         </div>
      );
   }

   if (services.length === 0) {
      return (
         <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
               <Wrench className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
               لا توجد خدمات متاحة
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
               لا توجد خدمات ضمن هذا التصنيف حالياً.
            </p>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
         {services.map((service) => {
            const isSelected = selectedServiceIds.includes(service.id);

            return (
               <button
                  key={service.id}
                  type="button"
                  onClick={() => onToggle(service.id)}
                  className={cn(
                     'text-right rounded-xl border p-4 transition-all duration-200',
                     'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                     isSelected
                        ? 'border-primary/40 bg-primary/5 shadow-sm'
                        : 'border-border/70 bg-card hover:border-primary/30 hover:shadow-sm'
                  )}
                  aria-pressed={isSelected}
               >
                  <div className="flex items-start justify-between gap-3">
                     <div className="space-y-2">
                        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                           {service.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                           اضغط لاختيار الخدمة أو إلغاء اختيارها.
                        </p>
                     </div>
                     <CheckCircle2
                        className={cn(
                           'mt-0.5 h-5 w-5 shrink-0 transition-colors',
                           isSelected
                              ? 'text-primary'
                              : 'text-muted-foreground/40'
                        )}
                     />
                  </div>
               </button>
            );
         })}
      </div>
   );
}

export default ServicesGridSelector;
