'use client';

import { CheckCircle2, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { usePublicServices } from '@/hooks/public/use-public-services';

export type ServicesPickerTheme = 'default' | 'admin';

export interface ServicesPickerProps {
   careerId?: number | null;
   value: number[];
   onChange: (next: number[]) => void;
   disabled?: boolean;
   perPage?: number;
   theme?: ServicesPickerTheme;
}

export function ServicesPicker({
   careerId,
   value,
   onChange,
   disabled,
   perPage = 100,
   theme = 'default',
}: ServicesPickerProps) {
   const { services, isLoading } = usePublicServices({
      careerId: careerId || undefined,
      perPage,
   });

   const handleToggle = (serviceId: number) => {
      if (disabled) return;
      onChange(
         value.includes(serviceId)
            ? value.filter((v) => v !== serviceId)
            : [...value, serviceId]
      );
   };

   const isAdmin = theme === 'admin';

   if (!careerId) {
      return (
         <EmptyPlaceholder isAdmin={isAdmin}>
            <p
               className={cn(
                  'text-sm font-medium',
                  isAdmin ? 'text-gray-700' : 'text-foreground'
               )}
            >
               اختر المجال المهني
            </p>
            <p
               className={cn(
                  'mt-1 text-xs',
                  isAdmin ? 'text-gray-400' : 'text-muted-foreground'
               )}
            >
               اختر المجال المهني أولاً لعرض الخدمات المتاحة
            </p>
         </EmptyPlaceholder>
      );
   }

   if (isLoading) {
      return (
         <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
               <Card
                  key={i}
                  className={cn(
                     'overflow-hidden border',
                     isAdmin ? 'border-gray-200' : 'border-border/60'
                  )}
               >
                  <CardContent className="space-y-2 p-3">
                     <div
                        className={cn(
                           'h-4 w-2/3 animate-pulse rounded',
                           isAdmin ? 'bg-gray-200' : 'bg-muted'
                        )}
                     />
                     <div
                        className={cn(
                           'h-3 w-full animate-pulse rounded',
                           isAdmin ? 'bg-gray-100' : 'bg-muted'
                        )}
                     />
                  </CardContent>
               </Card>
            ))}
         </div>
      );
   }

   if (!services || services.length === 0) {
      return (
         <EmptyPlaceholder isAdmin={isAdmin}>
            <p
               className={cn(
                  'text-sm font-medium',
                  isAdmin ? 'text-gray-700' : 'text-foreground'
               )}
            >
               لا توجد خدمات متاحة
            </p>
            <p
               className={cn(
                  'mt-1 text-xs',
                  isAdmin ? 'text-gray-400' : 'text-muted-foreground'
               )}
            >
               لا توجد خدمات متاحة لهذا المجال حالياً.
            </p>
         </EmptyPlaceholder>
      );
   }

   return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
         {services.map((service) => {
            const isSelected = value.includes(service.id);

            return (
               <button
                  key={service.id}
                  type="button"
                  onClick={() => handleToggle(service.id)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  className={cn(
                     'text-right rounded-lg border p-3 transition-all duration-150',
                     'focus-visible:outline-none focus-visible:ring-2',
                     disabled && 'opacity-50 cursor-not-allowed',
                     isAdmin
                        ? [
                             'focus-visible:ring-gray-400/50',
                             isSelected
                                ? 'border-gray-400 bg-gray-100 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                          ]
                        : [
                             'focus-visible:ring-primary/30',
                             isSelected
                                ? 'border-primary/40 bg-primary/5 shadow-sm'
                                : 'border-border/70 bg-card hover:border-primary/30 hover:shadow-sm',
                          ]
                  )}
               >
                  <div className="flex items-center justify-between gap-2">
                     <span
                        className={cn(
                           'line-clamp-1 text-sm font-medium',
                           isAdmin ? 'text-gray-800' : 'text-foreground'
                        )}
                     >
                        {service.name}
                     </span>
                     <CheckCircle2
                        className={cn(
                           'h-4 w-4 shrink-0 transition-colors',
                           isAdmin
                              ? isSelected
                                 ? 'text-gray-700'
                                 : 'text-gray-300'
                              : isSelected
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

function EmptyPlaceholder({
   isAdmin,
   children,
}: {
   isAdmin: boolean;
   children: React.ReactNode;
}) {
   return (
      <div
         className={cn(
            'rounded-lg border border-dashed p-6 text-center',
            isAdmin
               ? 'border-gray-200 bg-gray-50'
               : 'border-border/80 bg-muted/20'
         )}
      >
         <div
            className={cn(
               'mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full',
               isAdmin
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-muted text-muted-foreground'
            )}
         >
            <Wrench className="h-4 w-4" />
         </div>
         {children}
      </div>
   );
}

export default ServicesPicker;
