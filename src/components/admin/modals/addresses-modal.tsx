'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { ListItemRow } from '@/components/admin/ui/list-item-row';
import { InlineAddRow } from '@/components/admin/ui/inline-add-row';
import { useAddresses } from '@/hooks/use-addresses';
import type { Address } from '@/types/address';
import type { BaseModalProps } from './base-modal';

export function AddressesModal({ open }: BaseModalProps) {
   const {
      addresses,
      isLoading,
      isAdding: isAddingApi,
      isDeleting,
      addAddress,
      deleteAddress,
   } = useAddresses();

   const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

   const handleConfirmDelete = async () => {
      if (!deletingAddress) return;
      try {
         await deleteAddress(deletingAddress.id);
         setDeletingAddress(null);
      } catch {
         // Error handled by hook
      }
   };

   const handleSave = async (value: string) => {
      if (!value.trim()) return;
      try {
         await addAddress(value.trim());
      } catch {
         // Error handled by hook
      }
   };

   return (
      <>
         <AppModal
            open={open}
            title="إدارة العناوين"
            description="إضافة وحذف العناوين"
            closeHref="/admin/dashboard"
            closeButtonText="إغلاق"
         >
            <div className="space-y-3">
               <InlineAddRow
                  triggerLabel="إضافة عنوان جديد"
                  placeholder="اكتب اسم العنوان..."
                  icon={<MapPin className="h-5 w-5 text-gray-500" />}
                  onSave={handleSave}
                  isSaving={isAddingApi}
                  disabled={isLoading}
               />

               <div className="space-y-2">
                  {isLoading ? (
                     <LoadingState message="جاري تحميل العناوين..." size="md" />
                  ) : addresses.length === 0 ? (
                     <EmptyState
                        icon={<MapPin className="h-10 w-10" />}
                        title="لا توجد عناوين"
                     />
                  ) : (
                     addresses.map((address) => (
                        <ListItemRow
                           key={address.id}
                           id={address.id}
                           title={address.area_name}
                           icon={<MapPin className="h-5 w-5 text-gray-500" />}
                           onDelete={() => setDeletingAddress(address)}
                           isDeleting={isDeleting}
                        />
                     ))
                  )}
               </div>
               <ItemCount
                  count={addresses.length}
                  label="عنوان"
                  className="pt-4 border-t border-gray-200"
               />
            </div>
         </AppModal>

         <DeleteConfirmDialog
            open={!!deletingAddress}
            onOpenChange={(open) => !open && setDeletingAddress(null)}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف العنوان{' '}
                  <span className="font-medium text-gray-900">
                     {deletingAddress?.area_name}
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
