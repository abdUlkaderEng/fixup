'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
   Plus,
   Search,
   Edit2,
   Trash2,
   Wrench,
   Briefcase,
   AlertCircle,
   Loader2,
} from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui/select';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { useServices } from '@/hooks/use-services';
import { useServiceManagement } from '@/hooks/use-service-management';
import { adminApi } from '@/api/admin';
import type { Service, Career } from '@/types/service';

// ============================================
// Types
// ============================================
interface ServiceFormData {
   name: string;
}

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
         <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
            <div className="flex items-center gap-2">
               <Input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  className="flex-1 bg-white border-gray-300 h-9"
                  autoFocus
                  disabled={isUpdating}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') onEditSave();
                     if (e.key === 'Escape') onEditCancel();
                  }}
               />
               <Button
                  size="sm"
                  className="h-9 bg-gray-900 text-white hover:bg-gray-800"
                  onClick={onEditSave}
                  disabled={!editValue.trim() || isUpdating}
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
                  className="h-9 border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={onEditCancel}
                  disabled={isUpdating}
               >
                  إلغاء
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
         <div className="flex items-center justify-between gap-4">
            <h4 className="font-medium text-gray-900 flex-1">{service.name}</h4>
            <div className="flex items-center gap-1">
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  onClick={() => onEditStart(service)}
               >
                  <Edit2 className="h-4 w-4" />
               </Button>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-100"
                  onClick={() => onDelete(service)}
               >
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}

interface ServiceFormProps {
   careerName: string;
   onSubmit: (data: ServiceFormData) => void;
   onCancel: () => void;
   isSubmitting?: boolean;
}

function ServiceForm({
   careerName,
   onSubmit,
   onCancel,
   isSubmitting,
}: ServiceFormProps) {
   const [formData, setFormData] = useState<ServiceFormData>({
      name: '',
   });

   const isValid = formData.name.trim().length > 0;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid) {
         onSubmit(formData);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Briefcase className="h-4 w-4" />
            <span>المهنة:</span>
            <span className="font-medium text-gray-700">{careerName}</span>
         </div>

         <div className="space-y-2">
            <Label htmlFor="name">اسم الخدمة</Label>
            <Input
               id="name"
               value={formData.name}
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
               }
               placeholder="مثال: إصلاح تسرب المياه"
               className="bg-white border-gray-300"
               disabled={isSubmitting}
            />
         </div>

         <div className="flex justify-end gap-2 pt-4">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               className="border-gray-300 text-gray-700 hover:bg-gray-100"
               disabled={isSubmitting}
            >
               إلغاء
            </Button>
            <Button
               type="submit"
               disabled={!isValid || isSubmitting}
               className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
               {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
               ) : null}
               إضافة الخدمة
            </Button>
         </div>
      </form>
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

   // Add dialog state
   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
   } = useServiceManagement(() => {
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
      async (formData: ServiceFormData) => {
         if (!selectedCareerId) return;

         const result = await createService({
            name: formData.name.trim(),
            career_id: selectedCareerId,
         });

         if (result.success) {
            setIsAddDialogOpen(false);
         }
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
         <AdminModal
            open={open}
            title="إدارة الخدمات"
            description="إدارة خدمات المهن وتحديد الأسعار والمدد"
         >
            <div className="space-y-5">
               {/* Career Selector */}
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     اختيار المهنة
                  </label>
                  <Select
                     value={selectedCareerId?.toString()}
                     onValueChange={(value) =>
                        setSelectedCareerId(Number(value))
                     }
                     disabled={isLoadingCareers || careers.length === 0}
                  >
                     <SelectTrigger className="w-full bg-white border-gray-300 h-11">
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
                     <SelectContent
                        className="bg-white border-gray-200"
                        position="popper"
                        sideOffset={4}
                     >
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

               {/* Stats & Add Button */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                     <span className="font-medium text-gray-900">
                        {isLoading ? '...' : filteredServices.length}
                     </span>{' '}
                     خدمة
                  </div>
                  <Button
                     onClick={() => setIsAddDialogOpen(true)}
                     className="bg-gray-900 text-white hover:bg-gray-800 gap-2"
                     disabled={isLoading || !selectedCareerId}
                  >
                     <Plus className="h-4 w-4" />
                     إضافة خدمة
                  </Button>
               </div>

               {/* Search */}
               <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث في الخدمات..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                     disabled={isLoading}
                  />
               </div>

               {/* Services List */}
               <div className="space-y-3">
                  {isLoading ? (
                     <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Loader2 className="h-12 w-12 mx-auto mb-3 text-gray-300 animate-spin" />
                        <p className="text-gray-500">جاري تحميل الخدمات...</p>
                     </div>
                  ) : filteredServices.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-1">
                           لا توجد خدمات مسجلة
                        </p>
                        <p className="text-sm text-gray-400">
                           أضف خدمة جديدة لهذه المهنة
                        </p>
                     </div>
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

               <ModalActions>
                  <CloseButton />
               </ModalActions>
            </div>
         </AdminModal>

         {/* Add Service Dialog */}
         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
               <DialogHeader>
                  <DialogTitle className="text-gray-900">
                     إضافة خدمة جديدة
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     أدخل تفاصيل الخدمة الجديدة للمهنة المحددة
                  </DialogDescription>
               </DialogHeader>
               <ServiceForm
                  careerName={selectedCareer?.name ?? ''}
                  onSubmit={handleAddService}
                  onCancel={() => setIsAddDialogOpen(false)}
                  isSubmitting={isCreating}
               />
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={!!deletingService}
            onOpenChange={() => setDeletingService(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                     <AlertCircle className="h-5 w-5 text-red-500" />
                     تأكيد الحذف
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     هل أنت متأكد من حذف الخدمة{' '}
                     <span className="font-medium text-gray-900">
                        {deletingService?.name}
                     </span>
                     ؟ لا يمكن التراجع عن هذا الإجراء.
                  </DialogDescription>
               </DialogHeader>
               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     variant="outline"
                     onClick={() => setDeletingService(null)}
                     className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                     إلغاء
                  </Button>
                  <Button
                     onClick={handleDeleteService}
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
