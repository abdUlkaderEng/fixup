'use client';

import React, { useState, useCallback } from 'react';
import {
   Plus,
   Trash2,
   Briefcase,
   AlertCircle,
   Loader2,
   X,
   Check,
} from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { useCareers } from '@/hooks/use-careers';
import { useCareerManagement } from '@/hooks/use-career-management';
import type { CareerWithTimestamp } from '@/types/service';

// ============================================
// Types
// ============================================
interface CareerRowProps {
   career: CareerWithTimestamp;
   onDelete: (career: CareerWithTimestamp) => void;
   isDeleting?: boolean;
}

interface AddRowProps {
   onSave: (name: string) => void;
   onCancel: () => void;
   isAdding?: boolean;
}

// ============================================
// Components
// ============================================

/**
 * Career row with inline delete action
 */
function CareerRow({ career, onDelete, isDeleting }: CareerRowProps) {
   return (
      <div className="group flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
         <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
               <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <span className="font-medium text-gray-900 truncate">
               {career.name}
            </span>
         </div>
         <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(career)}
            disabled={isDeleting}
         >
            {isDeleting ? (
               <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
               <Trash2 className="h-4 w-4" />
            )}
         </Button>
      </div>
   );
}

/**
 * Add row with input field inline
 */
function AddRow({ onSave, onCancel, isAdding }: AddRowProps) {
   const [value, setValue] = useState('');

   const handleSave = () => {
      const trimmed = value.trim();
      if (trimmed) {
         onSave(trimmed);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSave();
      } else if (e.key === 'Escape') {
         onCancel();
      }
   };

   return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-lg">
         <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Plus className="h-5 w-5 text-gray-500" />
         </div>
         <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اسم المهنة الجديدة..."
            className="flex-1 bg-white border-gray-300 h-10"
            autoFocus
            disabled={isAdding}
         />
         <Button
            size="sm"
            className="h-10 bg-gray-900 text-white hover:bg-gray-800 px-3"
            onClick={handleSave}
            disabled={!value.trim() || isAdding}
         >
            {isAdding ? (
               <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
               <Check className="h-4 w-4" />
            )}
         </Button>
         <Button
            size="sm"
            variant="outline"
            className="h-10 border-gray-300 text-gray-700 hover:bg-gray-100 px-3"
            onClick={onCancel}
            disabled={isAdding}
         >
            <X className="h-4 w-4" />
         </Button>
      </div>
   );
}

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
      useCareerManagement(refetch);

   // UI states
   const [isAddingRow, setIsAddingRow] = useState(false);
   const [deletingCareer, setDeletingCareer] =
      useState<CareerWithTimestamp | null>(null);

   // ============================================
   // Handlers
   // ============================================

   /**
    * Add a new career
    */
   const handleAddCareer = useCallback(
      async (name: string) => {
         const result = await createCareer({ name });

         if (result.success) {
            setIsAddingRow(false);
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
         <AdminModal
            open={open}
            title="إدارة المهن"
            description="إضافة وحذف المهن المتاحة في النظام"
         >
            <div className="space-y-4">
               {/* Stats */}
               <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                     {isLoadingCareers ? '...' : careers.length}
                  </span>{' '}
                  مهنة
               </div>

               {/* Add Button Row */}
               {!isAddingRow && (
                  <button
                     onClick={() => setIsAddingRow(true)}
                     className="w-full flex items-center justify-center gap-2 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                  >
                     <Plus className="h-5 w-5" />
                     <span className="font-medium">إضافة مهنة جديدة</span>
                  </button>
               )}

               {/* Add Input Row */}
               {isAddingRow && (
                  <AddRow
                     onSave={handleAddCareer}
                     onCancel={() => setIsAddingRow(false)}
                     isAdding={isCreating}
                  />
               )}

               {/* Careers List */}
               <div className="space-y-2 max-h-100 overflow-y-auto scrollbar-modern pr-1">
                  {isLoadingCareers ? (
                     <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Loader2 className="h-12 w-12 mx-auto mb-3 text-gray-300 animate-spin" />
                        <p className="text-gray-500">جاري تحميل المهن...</p>
                     </div>
                  ) : careers.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-1">لا توجد مهن مسجلة</p>
                        <p className="text-sm text-gray-400">
                           أضف مهنة جديدة للبدء
                        </p>
                     </div>
                  ) : (
                     careers.map((career) => (
                        <CareerRow
                           key={career.id}
                           career={career}
                           onDelete={setDeletingCareer}
                           isDeleting={isDeleting}
                        />
                     ))
                  )}
               </div>

               <ModalActions>
                  <CloseButton />
               </ModalActions>
            </div>
         </AdminModal>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={!!deletingCareer}
            onOpenChange={(open) => !open && setDeletingCareer(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                     <AlertCircle className="h-5 w-5 text-red-500" />
                     تأكيد الحذف
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     هل أنت متأكد من حذف المهنة{' '}
                     <span className="font-medium text-gray-900">
                        {deletingCareer?.name}
                     </span>
                     ؟ لا يمكن التراجع عن هذا الإجراء.
                  </DialogDescription>
               </DialogHeader>
               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     variant="outline"
                     onClick={() => setDeletingCareer(null)}
                     className="border-gray-300 text-gray-700 hover:bg-gray-100"
                     disabled={isDeleting}
                  >
                     إلغاء
                  </Button>
                  <Button
                     onClick={handleDeleteCareer}
                     disabled={isDeleting}
                     className="bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  >
                     {isDeleting ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                     ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                     )}
                     حذف
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
