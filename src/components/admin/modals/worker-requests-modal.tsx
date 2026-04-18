'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
   Check,
   X,
   Edit2,
   Trash2,
   UserCheck,
   Clock,
   AlertCircle,
   Loader2,
   ChevronLeft,
   ChevronRight,
   RefreshCw,
} from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { usePendingWorkers } from '@/hooks/use-pending-workers';
import { useWorkerManagement } from '@/hooks/use-worker-management';
import type { Worker, WorkerStatus } from '@/types/worker';
import { WORKER_SERVICES } from '@/lib/admin/mock-data';

const STATUS_OPTIONS: { value: WorkerStatus; label: string }[] = [
   { value: 'waiting', label: 'قيد الانتظار' },
   { value: 'active', label: 'نشط' },
   { value: 'blocked', label: 'محظور' },
];

interface DisplayWorker extends Worker {
   firstName?: string;
   lastName?: string;
   email?: string;
   phone?: string;
   service?: string;
}

export function WorkerRequestsModal({ open }: BaseModalProps) {
   const {
      workers,
      isLoading,
      error,
      currentPage,
      totalPages,
      totalWorkers,
      statusFilter,
      setStatusFilter,
      nextPage,
      prevPage,
      refetch,
      fetch,
      hasNextPage,
      hasPrevPage,
   } = usePendingWorkers({ perPage: 10 });

   const { isUpdating, isDeleting, updateWorker, deleteWorker, approveWorker } =
      useWorkerManagement(refetch);

   // Reset fetch flag when filter changes to allow new fetch
   const prevFilterRef = useRef(statusFilter);
   useEffect(() => {
      if (prevFilterRef.current !== statusFilter) {
         prevFilterRef.current = statusFilter;
         hasFetchedRef.current = false;
      }
   }, [statusFilter]);

   const { status: sessionStatus } = useSession();
   const hasFetchedRef = useRef(false);

   useEffect(() => {
      if (sessionStatus !== 'authenticated') return;

      if (open && !hasFetchedRef.current) {
         hasFetchedRef.current = true;
         fetch();
      }
      if (!open) {
         hasFetchedRef.current = false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, sessionStatus]);

   const [editingWorker, setEditingWorker] = useState<DisplayWorker | null>(
      null
   );
   const [deletingWorker, setDeletingWorker] = useState<DisplayWorker | null>(
      null
   );

   const displayWorkers: DisplayWorker[] = workers.map((w) => ({
      ...w,
      firstName: `عامل #${w.user_id}`,
      lastName: '',
      email: `user_${w.user_id}@fixup.com`,
      service: `تصنيف ${w.career_id}`,
   }));

   const handleApprove = async (workerId: number) => {
      await approveWorker(workerId);
   };

   const handleDelete = (worker: DisplayWorker) => {
      setDeletingWorker(worker);
   };

   const confirmDelete = async () => {
      if (deletingWorker) {
         const success = await deleteWorker(deletingWorker.id);
         if (success) {
            setDeletingWorker(null);
         }
      }
   };

   const handleEdit = (worker: DisplayWorker) => {
      setEditingWorker({ ...worker });
   };

   const saveEdit = async () => {
      if (editingWorker) {
         const success = await updateWorker(editingWorker.id, {
            career_id: editingWorker.career_id,
         });
         if (success) {
            setEditingWorker(null);
         }
      }
   };

   const pendingCount = totalWorkers;

   return (
      <>
         <AdminModal
            open={open}
            title="طلبات العمال"
            description={`إدارة طلبات التسجيل (${pendingCount} قيد الانتظار)`}
            className="max-w-4xl"
         >
            <div className="space-y-4">
               {/* Status Filter */}
               <div className="flex items-center gap-4 pb-2 border-b border-gray-200">
                  <label className="text-sm text-gray-600">حالة الحساب:</label>
                  <Select
                     value={statusFilter}
                     onValueChange={(value) =>
                        setStatusFilter(value as WorkerStatus)
                     }
                  >
                     <SelectTrigger className="w-40 bg-white border-gray-300">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-white">
                        {STATUS_OPTIONS.map((option) => (
                           <SelectItem key={option.value} value={option.value}>
                              {option.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500 mr-auto">
                     {totalWorkers} عامل
                  </span>
               </div>

               {/* Loading State */}
               {isLoading && (
                  <div className="text-center py-12 text-gray-500">
                     <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                     <p>جاري تحميل طلبات العمال...</p>
                  </div>
               )}

               {/* Error State */}
               {!isLoading && error && (
                  <div className="text-center py-12 text-red-500">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                     <p className="mb-2">{error}</p>
                     <Button
                        variant="outline"
                        onClick={refetch}
                        className="mt-2 gap-2"
                     >
                        <RefreshCw className="h-4 w-4" />
                        إعادة المحاولة
                     </Button>
                  </div>
               )}

               {/* Empty State */}
               {!isLoading && !error && displayWorkers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>لا توجد طلبات عمال حالياً</p>
                  </div>
               )}

               {/* Workers List */}
               {!isLoading && !error && displayWorkers.length > 0 && (
                  <div className="grid gap-4">
                     {displayWorkers.map((worker) => (
                        <div
                           key={worker.id}
                           className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                        >
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                                    {worker.firstName?.[0] || 'ع'}
                                 </div>
                                 <div>
                                    <h4 className="font-medium text-gray-900">
                                       {worker.firstName} {worker.lastName}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                       {worker.email}
                                    </p>
                                 </div>
                              </div>
                              <Badge
                                 variant={
                                    worker.status === 'active'
                                       ? 'default'
                                       : 'secondary'
                                 }
                                 className={
                                    worker.status === 'active'
                                       ? 'bg-green-100 text-green-700 border-green-300'
                                       : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                 }
                              >
                                 {worker.status === 'active' ? (
                                    <>
                                       <UserCheck className="h-3 w-3 mr-1" />
                                       نشط
                                    </>
                                 ) : (
                                    <>
                                       <Clock className="h-3 w-3 mr-1" />
                                       قيد الانتظار
                                    </>
                                 )}
                              </Badge>
                           </div>

                           <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-gray-600">
                                 <span className="text-gray-400">الخدمة:</span>{' '}
                                 {worker.service}
                              </div>
                              <div className="text-gray-600">
                                 <span className="text-gray-400">
                                    سنوات الخبرة:
                                 </span>{' '}
                                 {worker.years_experience} سنة
                              </div>
                              <div className="text-gray-600 col-span-2">
                                 <span className="text-gray-400">نبذة:</span>{' '}
                                 {worker.about}
                              </div>
                              <div className="text-gray-600 col-span-2">
                                 <span className="text-gray-400">
                                    تاريخ الطلب:
                                 </span>{' '}
                                 {new Date(
                                    worker.created_at
                                 ).toLocaleDateString('ar-SA')}
                              </div>
                           </div>

                           <div className="flex items-center justify-end gap-2 pt-2">
                              {worker.status === 'waiting' && (
                                 <Button
                                    size="sm"
                                    onClick={() => handleApprove(worker.id)}
                                    className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                 >
                                    <Check className="h-4 w-4 mr-1" />
                                    قبول
                                 </Button>
                              )}
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleEdit(worker)}
                                 className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                 <Edit2 className="h-4 w-4 mr-1" />
                                 تعديل
                              </Button>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleDelete(worker)}
                                 className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-600"
                              >
                                 <Trash2 className="h-4 w-4 mr-1" />
                                 حذف
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {/* Pagination */}
               {!isLoading &&
                  !error &&
                  displayWorkers.length > 0 &&
                  totalPages > 1 && (
                     <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <Button
                           variant="outline"
                           onClick={prevPage}
                           disabled={!hasPrevPage}
                           className="gap-2"
                        >
                           <ChevronRight className="h-4 w-4" />
                           السابق
                        </Button>
                        <span className="text-sm text-gray-600">
                           صفحة {currentPage} من {totalPages}
                        </span>
                        <Button
                           variant="outline"
                           onClick={nextPage}
                           disabled={!hasNextPage}
                           className="gap-2"
                        >
                           التالي
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                     </div>
                  )}

               <ModalActions>
                  <CloseButton />
               </ModalActions>
            </div>
         </AdminModal>

         {/* Edit Dialog */}
         <Dialog
            open={!!editingWorker}
            onOpenChange={() => setEditingWorker(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
               <DialogHeader>
                  <DialogTitle className="text-gray-900">
                     تعديل بيانات العامل
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     تعديل معلومات العامل المقدم
                  </DialogDescription>
               </DialogHeader>
               {editingWorker && (
                  <div className="space-y-4 py-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-gray-600">الاسم الأول</Label>
                           <Input
                              value={editingWorker.firstName || ''}
                              onChange={(e) =>
                                 setEditingWorker(
                                    (prev: DisplayWorker | null) =>
                                       prev
                                          ? {
                                               ...prev,
                                               firstName: e.target.value,
                                            }
                                          : null
                                 )
                              }
                              className="bg-white border-gray-300 text-gray-900"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-gray-600">اسم العائلة</Label>
                           <Input
                              value={editingWorker.lastName || ''}
                              onChange={(e) =>
                                 setEditingWorker(
                                    (prev: DisplayWorker | null) =>
                                       prev
                                          ? {
                                               ...prev,
                                               lastName: e.target.value,
                                            }
                                          : null
                                 )
                              }
                              className="bg-white border-gray-300 text-gray-900"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-gray-600">
                           البريد الإلكتروني
                        </Label>
                        <Input
                           type="email"
                           value={editingWorker.email || ''}
                           onChange={(e) =>
                              setEditingWorker((prev: DisplayWorker | null) =>
                                 prev
                                    ? { ...prev, email: e.target.value }
                                    : null
                              )
                           }
                           className="bg-white border-gray-300 text-gray-900"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-gray-600">رقم الهاتف</Label>
                        <Input
                           value={editingWorker.phone || ''}
                           onChange={(e) =>
                              setEditingWorker((prev: DisplayWorker | null) =>
                                 prev
                                    ? { ...prev, phone: e.target.value }
                                    : null
                              )
                           }
                           className="bg-white border-gray-300 text-gray-900"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-gray-600">فئة الخدمة</Label>
                        <Select
                           value={editingWorker.service || ''}
                           onValueChange={(value) =>
                              setEditingWorker((prev: DisplayWorker | null) =>
                                 prev ? { ...prev, service: value } : null
                              )
                           }
                        >
                           <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-gray-300">
                              {WORKER_SERVICES.map((service) => (
                                 <SelectItem key={service} value={service}>
                                    {service}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           variant="outline"
                           onClick={() => setEditingWorker(null)}
                           className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                           إلغاء
                        </Button>
                        <Button
                           onClick={saveEdit}
                           disabled={isUpdating}
                           className="bg-gray-900 text-white hover:bg-gray-800"
                        >
                           {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              'حفظ التغييرات'
                           )}
                        </Button>
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={!!deletingWorker}
            onOpenChange={() => setDeletingWorker(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                     <AlertCircle className="h-5 w-5 text-red-400" />
                     تأكيد الحذف
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     هل أنت متأكد من حذف حساب العامل{' '}
                     <span className="text-gray-900 font-medium">
                        {deletingWorker?.firstName} {deletingWorker?.lastName}
                     </span>
                     ؟ لا يمكن التراجع عن هذا الإجراء.
                  </DialogDescription>
               </DialogHeader>
               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     variant="outline"
                     onClick={() => setDeletingWorker(null)}
                     className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                     <X className="h-4 w-4 mr-1" />
                     إلغاء
                  </Button>
                  <Button
                     onClick={confirmDelete}
                     disabled={isDeleting}
                     className="bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  >
                     {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <>
                           <Trash2 className="h-4 w-4 mr-1" />
                           حذف الحساب
                        </>
                     )}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
