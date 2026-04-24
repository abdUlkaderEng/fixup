'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Edit2, Trash2, Wrench, Briefcase, Loader2 } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { ListItemRow } from '@/components/admin/ui/list-item-row';
import { InlineAddRow } from '@/components/admin/ui/inline-add-row';
import { SearchInput } from '@/components/ui/search-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { useServices, useServiceMutations } from '@/hooks/admin';
import { adminApi } from '@/api/admin';
import type { Service, Career } from '@/types/service';
import type { BaseModalProps } from './base-modal';

// ============================================
// Components
// ============================================

interface ServiceCardProps {
   service: Service;
   isEditing: boolean;
   editValue: string;
   onEditStart: (service: Service) => void;
   onEditChange: (value: string) => void;
   onEditSave: () => void;
   onEditCancel: () => void;
   onDelete: (service: Service) => void;
   isUpdating?: boolean;
}

function ServiceCard({
   service,
   isEditing,
   editValue,
   onEditStart,
   onEditChange,
   onEditSave,
   onEditCancel,
   onDelete,
   isUpdating,
}: ServiceCardProps) {
   if (isEditing) {
      return (
         <div className="admin-panel-subtle p-3">
            <div className="flex items-center gap-2">
               <Input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  className="flex-1 admin-input h-9"
                  autoFocus
                  disabled={isUpdating}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') onEditSave();
                     if (e.key === 'Escape') onEditCancel();
                  }}
               />
               <Button
                  size="sm"
                  onClick={onEditSave}
                  disabled={!editValue.trim() || isUpdating}
                  className="admin-btn-primary"
               >
                  {isUpdating ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     'حفظ'
                  )}
               </Button>
               <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditCancel}
                  disabled={isUpdating}
                  className="admin-btn-secondary h-9"
               >
                  إلغاء
               </Button>
            </div>
         </div>
      );
   }

   return (
      <ListItemRow
         id={service.id}
         title={service.name}
         icon={<Wrench className="h-5 w-5 text-gray-500" />}
         actions={
            <>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 admin-btn-ghost"
                  onClick={() => onEditStart(service)}
               >
                  <Edit2 className="h-4 w-4" />
               </Button>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 admin-btn-danger"
                  onClick={() => onDelete(service)}
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            </>
         }
      />
   );
}

// ============================================
//            Main Modal Component
// ============================================

export function ServicesModal({ open }: BaseModalProps) {
   // Careers state
   const [careers, setCareers] = useState<Career[]>([]);
   const [isLoadingCareers, setIsLoadingCareers] = useState(true);

   // Selected career
   const [selectedCareerId, setSelectedCareerId] = useState<number | undefined>(
      undefined
   );

   // Search query
   const [searchQuery, setSearchQuery] = useState('');

   // Edit state
   const [editingServiceId, setEditingServiceId] = useState<number | null>(
      null
   );
   const [editValue, setEditValue] = useState('');

   // Delete state
   const [deletingService, setDeletingService] = useState<Service | null>(null);

   // Fetch careers on mount
   useEffect(() => {
      if (!open) return;

      const fetchCareers = async () => {
         setIsLoadingCareers(true);
         try {
            const data = await adminApi.getCareers();
            setCareers(data);
            if (data.length > 0) {
               setSelectedCareerId((prev) => prev ?? data[0].id);
            }
         } catch {
            // Error handled by API
         } finally {
            setIsLoadingCareers(false);
         }
      };

      fetchCareers();
   }, [open]);

   // Services hook
   const {
      services,
      isLoading: isLoadingServices,
      setCareerFilter,
      refetch,
   } = useServices({
      careerId: selectedCareerId,
      autoFetch: false,
   });

   // Service management hook
   const {
      isCreating,
      isUpdating,
      isDeleting,
      createService,
      updateService,
      deleteService,
   } = useServiceMutations(() => {
      refetch();
   });

   // Fetch services when career changes
   useEffect(() => {
      console.log('[ServicesModal] Career changed to:', selectedCareerId);
      if (selectedCareerId !== undefined) {
         setCareerFilter(selectedCareerId);
      }
   }, [selectedCareerId, setCareerFilter]);

   // Selected career data
   const selectedCareer = useMemo(
      () => careers.find((c) => c.id === selectedCareerId),
      [careers, selectedCareerId]
   );

   // Filtered services by search query
   const filteredServices = useMemo(() => {
      if (!searchQuery.trim()) return services;
      return services.filter((service) =>
         service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
   }, [services, searchQuery]);

   const handleAddService = useCallback(
      async (name: string) => {
         if (!selectedCareerId) {
            throw new Error('No career selected');
         }
         await createService({
            name: name.trim(),
            career_id: selectedCareerId,
         });
      },
      [createService, selectedCareerId]
   );

   const handleEditStart = useCallback((service: Service) => {
      setEditingServiceId(service.id);
      setEditValue(service.name);
   }, []);

   const handleEditSave = useCallback(async () => {
      if (!editingServiceId || !editValue.trim()) return;

      const success = await updateService(editingServiceId, {
         name: editValue.trim(),
      });

      if (success) {
         setEditingServiceId(null);
         setEditValue('');
      }
   }, [editingServiceId, editValue, updateService]);

   const handleEditCancel = useCallback(() => {
      setEditingServiceId(null);
      setEditValue('');
   }, []);

   const handleDeleteService = useCallback(async () => {
      if (!deletingService) return;

      const success = await deleteService(deletingService.id);

      if (success) {
         setDeletingService(null);
      }
   }, [deletingService, deleteService]);

   // Loading state
   const isLoading = isLoadingCareers || isLoadingServices;

   return (
      <>
         <AppModal
            open={open}
            title="إدارة الخدمات"
            description="إدارة خدمات المهن "
            closeHref="/admin/dashboard"
            closeButtonText="إغلاق"
         >
            <div className="space-y-5">
               {/* Career Selector */}
               <div className="admin-panel p-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                     اختيار المهنة
                  </label>
                  <Select
                     value={selectedCareerId?.toString()}
                     onValueChange={(value) =>
                        setSelectedCareerId(Number(value))
                     }
                     disabled={isLoadingCareers || careers.length === 0}
                  >
                     <SelectTrigger className="w-full admin-input h-11">
                        <div className="flex items-center justify-center gap-2 w-full">
                           {isLoadingCareers ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                           ) : (
                              <Briefcase className="h-4 w-4 text-gray-500" />
                           )}
                           <span>
                              {isLoadingCareers
                                 ? 'جاري التحميل...'
                                 : (selectedCareer?.name ?? 'اختر المهنة')}
                           </span>
                        </div>
                     </SelectTrigger>
                     <SelectContent position="popper" sideOffset={4}>
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

               <ItemCount
                  count={filteredServices.length}
                  label="خدمة"
                  isLoading={isLoading}
               />

               {/* Search */}
               <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="البحث في الخدمات..."
                  disabled={isLoading}
                  className="w-full"
               />

               {/* Services List */}
               <div className="space-y-3">
                  {/* Inline Add Row with integrated button */}
                  <InlineAddRow
                     triggerLabel="إضافة خدمة جديدة"
                     placeholder="اسم الخدمة الجديدة..."
                     icon={<Wrench className="h-5 w-5 text-gray-500" />}
                     onSave={handleAddService}
                     isSaving={isCreating}
                     disabled={!selectedCareerId}
                  />

                  {isLoading ? (
                     <LoadingState message="جاري تحميل الخدمات..." size="lg" />
                  ) : filteredServices.length === 0 ? (
                     <EmptyState
                        icon={<Wrench className="h-10 w-10" />}
                        title="لا توجد خدمات"
                     />
                  ) : (
                     filteredServices.map((service) => (
                        <ServiceCard
                           key={service.id}
                           service={service}
                           isEditing={editingServiceId === service.id}
                           editValue={editValue}
                           onEditStart={handleEditStart}
                           onEditChange={setEditValue}
                           onEditSave={handleEditSave}
                           onEditCancel={handleEditCancel}
                           onDelete={setDeletingService}
                           isUpdating={isUpdating}
                        />
                     ))
                  )}
               </div>
            </div>
         </AppModal>

         <DeleteConfirmDialog
            open={!!deletingService}
            onOpenChange={(open) => !open && setDeletingService(null)}
            onConfirm={handleDeleteService}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف الخدمة{' '}
                  <span className="font-medium text-foreground">
                     {deletingService?.name}
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
