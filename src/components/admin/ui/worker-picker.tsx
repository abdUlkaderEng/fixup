'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Phone, Search, User as UserIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { useWorkers } from '@/hooks/admin';
import { useDebouncedValue } from '@/hooks/shared';
import { cn } from '@/lib/utils';
import type { Worker } from '@/types/entities/worker';

// ============================================
// Types
// ============================================

export interface WorkerPickerProps {
   /** Currently selected worker (controlled). */
   value: Worker | null;
   /** Fires when admin picks a worker. */
   onChange: (worker: Worker | null) => void;
   /** Optional label rendered above the picker. */
   label?: string;
   /** Disable while parent is busy (e.g. submitting). */
   disabled?: boolean;
   /** Show only active workers (default true). */
   activeOnly?: boolean;
   /** Per-page count for the worker list (default 50). */
   perPage?: number;
   className?: string;
   // Career filtering is disabled for now, so `defaultCareerId` is omitted.
   // To restore it, re-add the prop here, a career <Select> below, and the
   // matching `careerId` filter in useWorkers.
}

// ============================================
// Worker Picker
// ============================================

/**
 * Reusable worker picker with name + phone search.
 *
 * Composition:
 *  - Two <Input>s filter the worker list server-side (via useWorkers →
 *    `/admin/workers/filters`) by name and phone number, debounced.
 *  - Clicking a row commits the selection and collapses the panel.
 *
 * Once a worker is selected, the picker shows a compact summary card with a
 * "تغيير" (change) button to reopen the panel.
 */
export function WorkerPicker({
   value,
   onChange,
   label,
   disabled = false,
   activeOnly = true,
   perPage = 50,
   className,
}: WorkerPickerProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [nameInput, setNameInput] = useState('');
   const [phoneInput, setPhoneInput] = useState('');
   const debouncedName = useDebouncedValue(nameInput, 350);
   const debouncedPhone = useDebouncedValue(phoneInput, 350);

   const { workers, isLoading, setNameFilter, setPhoneFilter } = useWorkers({
      status: activeOnly ? 'active' : undefined,
      perPage,
      autoFetch: true,
   });

   // Push the debounced inputs into the server-side filters.
   useEffect(() => {
      setNameFilter(debouncedName.trim());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedName]);

   useEffect(() => {
      setPhoneFilter(debouncedPhone.trim());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [debouncedPhone]);

   const hasSearch = nameInput.trim() !== '' || phoneInput.trim() !== '';

   const handleSelect = useCallback(
      (worker: Worker) => {
         onChange(worker);
         setIsOpen(false);
         setNameInput('');
         setPhoneInput('');
      },
      [onChange]
   );

   const handleClear = useCallback(() => {
      onChange(null);
      setIsOpen(true);
   }, [onChange]);

   // Collapsed view when a worker is selected
   if (value && !isOpen) {
      return (
         <div className={cn('space-y-2', className)}>
            {label && (
               <label className="block text-sm font-medium text-gray-900">
                  {label}
               </label>
            )}
            <div className="flex items-center gap-3 admin-panel p-3">
               <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-primary" />
               </div>
               <div className="min-w-0 flex-1">
                  <p className="font-medium admin-text truncate">
                     {value.user?.name ?? 'بدون اسم'}
                  </p>
                  <p className="text-xs admin-text-muted truncate">
                     {value.career?.name ?? 'بدون مهنة'}
                     {value.user?.phone_number
                        ? ` • ${value.user.phone_number}`
                        : ''}
                  </p>
               </div>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="admin-btn-secondary h-9"
                  onClick={() => setIsOpen(true)}
                  disabled={disabled}
               >
                  تغيير
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 admin-btn-danger"
                  onClick={handleClear}
                  disabled={disabled}
                  aria-label="إلغاء الاختيار"
               >
                  <X className="h-4 w-4" />
               </Button>
            </div>
         </div>
      );
   }

   // Expanded picker
   return (
      <div className={cn('space-y-3', className)}>
         {label && (
            <label className="block text-sm font-medium text-gray-900">
               {label}
            </label>
         )}

         {/* Filters */}
         <div className="admin-panel p-3 space-y-3">
            {/* Career filter is disabled for now — see WorkerPickerProps note. */}

            {/* Name + phone search */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
               <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                     value={nameInput}
                     onChange={(e) => setNameInput(e.target.value)}
                     placeholder="بحث بالاسم..."
                     disabled={disabled}
                     className="admin-input h-10 pr-10"
                  />
               </div>
               <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                     value={phoneInput}
                     onChange={(e) => setPhoneInput(e.target.value)}
                     placeholder="بحث برقم الهاتف..."
                     inputMode="tel"
                     disabled={disabled}
                     className="admin-input h-10 pr-10"
                  />
               </div>
            </div>
         </div>

         {/* Workers list */}
         <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-modern pl-1">
            {isLoading ? (
               <LoadingState message="جاري تحميل العمال..." size="md" />
            ) : workers.length === 0 ? (
               <EmptyState
                  icon={<UserIcon className="h-10 w-10" />}
                  title="لا يوجد عمال"
                  description={
                     hasSearch
                        ? 'لا توجد نتائج تطابق البحث.'
                        : 'لا يوجد عمال نشطون حالياً.'
                  }
               />
            ) : (
               workers.map((worker) => {
                  const isSelected = value?.id === worker.id;
                  return (
                     <button
                        key={worker.id}
                        type="button"
                        onClick={() => handleSelect(worker)}
                        disabled={disabled}
                        className={cn(
                           'w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors',
                           'border border-transparent',
                           isSelected
                              ? 'bg-primary/5 border-primary/20'
                              : 'hover:bg-gray-50 border-gray-200',
                           'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                     >
                        <div
                           className={cn(
                              'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                              isSelected
                                 ? 'bg-primary text-primary-foreground'
                                 : 'bg-gray-100 text-gray-500'
                           )}
                        >
                           <UserIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="font-medium text-gray-900 truncate">
                              {worker.user?.name ?? 'بدون اسم'}
                           </p>
                           <p className="text-xs text-gray-500 truncate">
                              {worker.career?.name ?? 'بدون مهنة'}
                              {worker.user?.phone_number
                                 ? ` • ${worker.user.phone_number}`
                                 : ''}
                           </p>
                        </div>
                        {!isSelected && (
                           <ChevronDown className="h-4 w-4 text-gray-400 rotate-90 rtl:-rotate-90" />
                        )}
                     </button>
                  );
               })
            )}
         </div>
      </div>
   );
}

export default WorkerPicker;
