'use client';

import {
   Pencil,
   LogOut,
   X,
   Check,
   Loader2,
   RefreshCcw,
   Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveCancelProps {
   isSubmitting: boolean;
   onCancel: () => void;
   formId: string;
}

function SaveCancelButtons({
   isSubmitting,
   onCancel,
   formId,
}: SaveCancelProps) {
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
            form={formId}
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

interface ActionButtonsProps {
   isWorker: boolean;
   editMode: 'base' | 'worker' | null;
   isSubmitting: boolean;
   activeFormId: string;
   onEditBase: () => void;
   onEditWorker: () => void;
   onCancel: () => void;
   onLogout: () => void;
   showConvertButton?: boolean;
   onConvertToWorker?: () => void;
}

export function ActionButtons({
   isWorker,
   editMode,
   isSubmitting,
   activeFormId,
   onEditBase,
   onEditWorker,
   onCancel,
   onLogout,
   showConvertButton,
   onConvertToWorker,
}: ActionButtonsProps) {
   if (editMode !== null) {
      return (
         <SaveCancelButtons
            isSubmitting={isSubmitting}
            onCancel={onCancel}
            formId={activeFormId}
         />
      );
   }

   return (
      <div className="flex flex-col sm:flex-row gap-3">
         <Button
            type="button"
            variant="outline"
            onClick={onEditBase}
            className="flex-1 h-12 gap-2"
         >
            <Pencil className="h-4 w-4" />
            {isWorker ? 'تعديل البيانات الشخصية' : 'تعديل الملف الشخصي'}
         </Button>

         {isWorker && (
            <Button
               type="button"
               variant="outline"
               onClick={onEditWorker}
               className="flex-1 h-12 gap-2"
            >
               <Wrench className="h-4 w-4" />
               تعديل بيانات الفني
            </Button>
         )}

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
