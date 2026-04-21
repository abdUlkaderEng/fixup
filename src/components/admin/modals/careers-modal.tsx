'use client';

import { useState, useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { ListItemRow } from '@/components/admin/ui/list-item-row';
import { InlineAddRow } from '@/components/admin/ui/inline-add-row';
import { useCareers, useCareerMutations } from '@/hooks/admin';
import type { CareerWithTimestamp } from '@/types/service';
import type { BaseModalProps } from './base-modal';
import { DeleteConfirmDialog } from '@/components/ui';

// ============================================
//            Main Modal Component
// ============================================

export function CareersModal({ open }: BaseModalProps) {
   // API hooks
   const {
      careers,
      isLoading: isLoadingCareers,
      refetch,
   } = useCareers({
      autoFetch: open,
   });

   const { isCreating, isDeleting, createCareer, deleteCareer } =
      useCareerMutations(refetch);

   // UI states
   const [deletingCareer, setDeletingCareer] =
      useState<CareerWithTimestamp | null>(null);

   const handleAddCareer = useCallback(
      async (name: string) => {
         const result = await createCareer({ name });

         if (result.success) {
            // setIsAddingRow(false);
         }
      },
      [createCareer]
   );

   /**
    * Delete a career
    */
   const handleDeleteCareer = useCallback(async () => {
      if (!deletingCareer) return;

      const success = await deleteCareer(deletingCareer.id);

      if (success) {
         setDeletingCareer(null);
      }
   }, [deletingCareer, deleteCareer]);

   // ============================================
   // Render
   // ============================================

   return (
      <>
         <AppModal
            open={open}
            title="إدارة المهن"
            description="إضافة وحذف المهن المتاحة في النظام"
            closeHref="/admin/dashboard"
            closeButtonText="إغلاق"
         >
            <div className="space-y-4">
               <ItemCount
                  count={careers.length}
                  label="مهنة"
                  isLoading={isLoadingCareers}
               />

               {/* Inline Add Row with integrated button */}
               <InlineAddRow
                  triggerLabel="إضافة مهنة جديدة"
                  placeholder="اسم المهنة الجديدة..."
                  icon={<Briefcase className="h-5 w-5 text-gray-500" />}
                  onSave={handleAddCareer}
                  isSaving={isCreating}
               />

               {/* Careers List */}
               <div className="space-y-2 max-h-100 overflow-y-auto scrollbar-modern pr-1">
                  {isLoadingCareers ? (
                     <LoadingState message="جاري تحميل المهن..." size="lg" />
                  ) : careers.length === 0 ? (
                     <EmptyState
                        icon={<Briefcase className="h-12 w-12" />}
                        title="لا توجد مهن مسجلة"
                     />
                  ) : (
                     careers.map((career) => (
                        <ListItemRow
                           key={career.id}
                           id={career.id}
                           title={career.name}
                           subtitle={new Date(
                              career.created_at
                           ).toLocaleDateString('ar-SA')}
                           icon={
                              <Briefcase className="h-5 w-5 text-gray-500" />
                           }
                           onDelete={() => setDeletingCareer(career)}
                           isDeleting={isDeleting}
                        />
                     ))
                  )}
               </div>
            </div>
         </AppModal>

         <DeleteConfirmDialog
            open={!!deletingCareer}
            onOpenChange={(open) => !open && setDeletingCareer(null)}
            onConfirm={handleDeleteCareer}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف المهنة{' '}
                  <span className="font-medium text-gray-900">
                     {deletingCareer?.name}
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
