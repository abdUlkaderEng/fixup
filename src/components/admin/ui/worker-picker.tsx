'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
   Briefcase,
   ChevronDown,
   Loader2,
   Search,
   User as UserIcon,
   Wrench,
   X,
} from 'lucide-react';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { useCareers, useWorkers } from '@/hooks/admin';
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
   /** Initial career filter id (optional). */
   defaultCareerId?: number;
   /** Show only active workers (default true). */
   activeOnly?: boolean;
   /** Per-page count for the worker list (default 50). */
   perPage?: number;
   className?: string;
}

// ============================================
// Worker Picker
// ============================================

/**
 * Reusable worker picker with career filter + name/phone search.
 *
 * Composition:
 *  - Career <Select> filters the worker list server-side via useWorkers.
 *  - Search <Input> filters the visible workers client-side by name/phone.
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
   defaultCareerId,
   activeOnly = true,
   perPage = 50,
   className,
}: WorkerPickerProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [careerId, setCareerId] = useState<number | undefined>(
      defaultCareerId
   );
   const [search, setSearch] = useState('');

   const { careers, isLoading: isLoadingCareers } = useCareers({
      autoFetch: true,
   });

   const {
      workers,
      isLoading: isLoadingWorkers,
      fetch: fetchWorkers,
   } = useWorkers({
      status: activeOnly ? 'active' : undefined,
      perPage,
      autoFetch: true,
   });

   // Refetch when filters change.
   useEffect(() => {
      fetchWorkers(1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [careerId]);

   const filteredWorkers = useMemo(() => {
      const term = search.trim().toLowerCase();
      return workers.filter((w) => {
         if (careerId && w.career_id !== careerId) return false;
         if (!term) return true;
         const haystack = [
            w.user?.name ?? '',
            w.user?.phone_number ?? '',
            w.user?.email ?? '',
         ]
            .join(' ')
            .toLowerCase();
         return haystack.includes(term);
      });
   }, [workers, search, careerId]);

   const selectedCareer = useMemo(
      () => careers.find((c) => c.id === careerId),
      [careers, careerId]
   );

   const handleSelect = useCallback(
      (worker: Worker) => {
         onChange(worker);
         setIsOpen(false);
         setSearch('');
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
            {/* Career filter */}
            <div>
               <span className="block text-xs font-medium text-gray-600 mb-1.5">
                  تصفية حسب المهنة
               </span>
               <Select
                  value={careerId?.toString() ?? 'all'}
                  onValueChange={(v) =>
                     setCareerId(v === 'all' ? undefined : Number(v))
                  }
                  disabled={disabled || isLoadingCareers}
               >
                  <SelectTrigger className="w-full admin-input h-10">
                     <div className="flex items-center justify-center gap-2 w-full">
                        {isLoadingCareers ? (
                           <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                           <Briefcase className="h-4 w-4 text-gray-500" />
                        )}
                        <span>
                           {isLoadingCareers
                              ? 'جاري التحميل...'
                              : (selectedCareer?.name ?? 'كل المهن')}
                        </span>
                     </div>
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                     <SelectItem value="all" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                           <Wrench className="h-4 w-4 text-gray-500" />
                           <span>كل المهن</span>
                        </div>
                     </SelectItem>
                     {careers.map((career) => (
                        <SelectItem
                           key={career.id}
                           value={career.id.toString()}
                           className="cursor-pointer"
                        >
                           <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              <span>{career.name}</span>
                           </div>
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            {/* Search */}
            <div className="relative">
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
               <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث بالاسم أو رقم الهاتف..."
                  disabled={disabled || isLoadingWorkers}
                  className="admin-input h-10 pr-10"
               />
            </div>
         </div>

         {/* Workers list */}
         <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-modern pl-1">
            {isLoadingWorkers ? (
               <LoadingState message="جاري تحميل العمال..." size="md" />
            ) : filteredWorkers.length === 0 ? (
               <EmptyState
                  icon={<UserIcon className="h-10 w-10" />}
                  title="لا يوجد عمال"
                  description={
                     search
                        ? 'لا توجد نتائج تطابق البحث.'
                        : 'لا يوجد عمال نشطون في هذه المهنة.'
                  }
               />
            ) : (
               filteredWorkers.map((worker) => {
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
