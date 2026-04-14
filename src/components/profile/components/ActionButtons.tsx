'use client';

import { Pencil, LogOut, X, Check, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
   isEditing: boolean;
   isSubmitting: boolean;
   onEdit: () => void;
   onCancel: () => void;
   onLogout: () => void;
   showConvertButton: boolean;
   onConvertToWorker?: () => void;
}

export function ActionButtons({
   isEditing,
   isSubmitting,
   onEdit,
   onCancel,
   onLogout,
   showConvertButton,
   onConvertToWorker,
}: ActionButtonsProps) {
   if (isEditing) {
      return (
         <div className="flex gap-3 h-12">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               disabled={isSubmitting}
               className="flex-1 h-full gap-2"
            >
               <X className="h-4 w-4" />
               إلغاء
            </Button>
            <Button
               type="submit"
               disabled={isSubmitting}
               className="flex-1 h-full gap-2"
            >
               {isSubmitting ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                     جاري الحفظ...
                  </>
               ) : (
                  <>
                     <Check className="h-4 w-4" />
                     حفظ التغييرات
                  </>
               )}
            </Button>
         </div>
      );
   }

   return (
      <div className="flex flex-col sm:flex-row gap-3">
         <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="flex-1 h-12 gap-2"
         >
            <Pencil className="h-4 w-4" />
            تعديل الملف الشخصي
         </Button>

         {showConvertButton && onConvertToWorker && (
            <Button
               type="button"
               variant="secondary"
               onClick={onConvertToWorker}
               className="flex-1 h-12 gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
               <RefreshCcw className="h-4 w-4" />
               تحويل لحساب فني
            </Button>
         )}

         <Button
            type="button"
            variant="destructive"
            onClick={onLogout}
            className="flex-1 h-12 gap-2"
         >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
         </Button>
      </div>
   );
}
