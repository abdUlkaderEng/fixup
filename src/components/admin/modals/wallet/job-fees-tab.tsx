'use client';

import { useCallback, useMemo, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { SearchInput } from '@/components/ui/search-input';
import { useCareers, useJobFees } from '@/hooks/admin';
import { JobFeeRow } from './job-fee-row';

/**
 * Job fees management tab.
 *
 * Lists every career and lets admin set / update a per-career fee.
 * Saving is upsert (POST if no fee yet, PUT otherwise) — see useJobFees.
 */
export function JobFeesTab() {
   const { careers, isLoading: isLoadingCareers } = useCareers({
      autoFetch: true,
   });
   const {
      feesByCareer,
      isLoading: isLoadingFees,
      isSaving,
      saveFee,
   } = useJobFees({ autoFetch: true });

   const [search, setSearch] = useState('');

   const [savingCareerId, setSavingCareerId] = useState<number | null>(null);

   const filteredCareers = useMemo(() => {
      const term = search.trim().toLowerCase();
      if (!term) return careers;
      return careers.filter((c) => c.name.toLowerCase().includes(term));
   }, [careers, search]);

   const handleSave = useCallback(
      async (careerId: number, input: { fee: number; is_active: boolean }) => {
         setSavingCareerId(careerId);
         try {
            await saveFee(careerId, input);
         } finally {
            setSavingCareerId(null);
         }
      },
      [saveFee]
   );

   const isBusy = isLoadingCareers || isLoadingFees;

   return (
      <div className="space-y-4">
         {/* Search */}
         <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="البحث عن مهنة..."
            disabled={isBusy}
            className="w-full"
         />

         <ItemCount
            count={filteredCareers.length}
            label="مهنة"
            isLoading={isBusy}
         />

         {/* Careers list */}
         <div className="space-y-3 max-h-[55vh] overflow-y-auto scrollbar-modern pl-1">
            {isBusy && careers.length === 0 ? (
               <LoadingState message="جاري تحميل المهن..." size="lg" />
            ) : filteredCareers.length === 0 ? (
               <EmptyState
                  icon={<Briefcase className="h-10 w-10" />}
                  title={
                     careers.length === 0
                        ? 'لا توجد مهن مسجلة'
                        : 'لا توجد نتائج'
                  }
                  description={
                     careers.length === 0
                        ? 'أضف مهنة من تبويب "المهن" أولاً.'
                        : 'جرب تعديل البحث.'
                  }
               />
            ) : (
               filteredCareers.map((career) => (
                  <JobFeeRow
                     key={career.id}
                     career={career}
                     existing={feesByCareer.get(career.id)}
                     isSaving={isSaving && savingCareerId === career.id}
                     onSave={(input) => handleSave(career.id, input)}
                  />
               ))
            )}
         </div>
      </div>
   );
}
