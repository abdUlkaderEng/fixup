'use client';

import React, { useState } from 'react';
import { MapPin, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddresses } from '@/hooks/use-addresses';

/**
 * Addresses management modal - Connected to backend
 * Just name only, inline add button, input row on top
 */
export function AddressesModal({ open }: BaseModalProps) {
   const {
      addresses,
      isLoading,
      isAdding: isAddingApi,
      addAddress,
      deleteAddress,
   } = useAddresses();

   const [isAdding, setIsAdding] = useState(false);
   const [newAddressName, setNewAddressName] = useState('');

   const handleAddAddress = async () => {
      if (!newAddressName.trim()) return;

      try {
         await addAddress(newAddressName.trim());
         setNewAddressName(newAddressName.trim());
         setIsAdding(false);
      } catch {
         // Error handled by hook
      }
   };

   const handleDeleteAddress = async (id: number) => {
      try {
         await deleteAddress(id);
      } catch {
         // Error handled by hook
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleAddAddress();
      }
      if (e.key === 'Escape') {
         setIsAdding(false);
         setNewAddressName('');
      }
   };

   return (
      <AdminModal
         open={open}
         title="إدارة العناوين"
         description="إضافة وحذف العناوين"
      >
         <div className="space-y-3">
            {/* Add Input Row - Shows on top when adding */}
            {isAdding && (
               <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <Input
                     autoFocus
                     placeholder="اكتب اسم العنوان..."
                     value={newAddressName}
                     onChange={(e) => setNewAddressName(e.target.value)}
                     onKeyDown={handleKeyDown}
                     className="flex-1 bg-white border-gray-300 text-gray-900 h-9"
                  />
                  <Button
                     size="sm"
                     onClick={handleAddAddress}
                     disabled={!newAddressName.trim() || isAddingApi}
                     className="bg-gray-900 hover:bg-gray-800 text-white h-9 px-3"
                  >
                     {isAddingApi ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <Check className="h-4 w-4" />
                     )}
                  </Button>
                  <Button
                     size="sm"
                     variant="ghost"
                     onClick={() => {
                        setIsAdding(false);
                        setNewAddressName('');
                     }}
                     className="h-9 px-2 text-gray-500 hover:text-gray-700"
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            )}

            {/* Addresses List */}
            <div className="space-y-2">
               {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                     <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-gray-400" />
                     <p className="text-sm">جاري تحميل العناوين...</p>
                  </div>
               ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                     <p className="text-sm">لا توجد عناوين</p>
                  </div>
               ) : (
                  addresses.map((address) => (
                     <div
                        key={address.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                     >
                        <div className="flex items-center gap-3">
                           <MapPin className="h-4 w-4 text-gray-400" />
                           <span className="text-gray-900">
                              {address.area_name}
                           </span>
                        </div>

                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDeleteAddress(address.id)}
                           disabled={isAddingApi}
                           className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  ))
               )}
            </div>

            {/* Add Button - Inline at bottom */}
            {!isAdding && !isLoading && (
               <Button
                  variant="outline"
                  onClick={() => setIsAdding(true)}
                  disabled={isAddingApi}
                  className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 gap-2 h-10"
               >
                  {isAddingApi ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Plus className="h-4 w-4" />
                  )}
                  إضافة عنوان جديد
               </Button>
            )}

            <ModalActions>
               <div className="text-sm text-gray-500">
                  إجمالي العناوين: {addresses.length}
               </div>
               <CloseButton />
            </ModalActions>
         </div>
      </AdminModal>
   );
}
