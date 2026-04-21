'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
   Check,
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
import { AppModal } from '@/components/ui/app-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
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
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { usePendingWorkers } from '@/hooks/use-pending-workers';
import { useWorkerManagement } from '@/hooks/use-worker-management';
import type { Worker, WorkerStatus } from '@/types/worker';
import { WORKER_SERVICES } from '@/lib/admin/mock-data';
import type { BaseModalProps } from './base-modal';

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
         <AppModal
            open={open}
            title="طلبات العمال"
            description={`إدارة طلبات التسجيل (${pendingCount} قيد الانتظار)`}
            closeHref="/admin/dashboard"
            closeButtonText="إغلاق"
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
                     <SelectTrigger className="w-40 admin-input">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
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
                  <LoadingState
                     message="جاري تحميل طلبات العمال..."
                     size="lg"
                  />
               )}

               {/* Error State */}
               {!isLoading && error && (
                  <div className="text-center py-12">
                     <EmptyState
                        icon={
                           <AlertCircle className="h-12 w-12 text-destructive" />
                        }
                        title="حدث خطأ"
                        description={error}
                        action={
                           <Button
                              variant="outline"
                              onClick={refetch}
                              className="mt-2 gap-2"
                           >
                              <RefreshCw className="h-4 w-4" />
                              إعادة المحاولة
                           </Button>
                        }
                     />
                  </div>
               )}

               {/* Empty State */}
               {!isLoading && !error && displayWorkers.length === 0 && (
                  <EmptyState
                     icon={<AlertCircle className="h-12 w-12" />}
                     title="لا توجد طلبات عمال"
                     description="لا توجد طلبات عمال حالياً في هذه الفئة"
                  />
               )}

               {/* Workers List */}
               {!isLoading && !error && displayWorkers.length > 0 && (
                  <div className="grid gap-4">
                     {displayWorkers.map((worker) => (
                        <div
                           key={worker.id}
                           className="admin-panel p-4 space-y-3"
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
                                       ? 'admin-badge-success'
                                       : 'admin-badge-warning'
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
                              <div className="text-gray-900">
                                 <span className="text-gray-400">الخدمة:</span>{' '}
                                 {worker.service}
                              </div>
                              <div className="text-gray-900">
                                 <span className="text-gray-400">
                                    سنوات الخبرة:
                                 </span>{' '}
                                 {worker.years_experience} سنة
                              </div>
                              <div className="text-gray-900 col-span-2">
                                 <span className="text-gray-400">نبذة:</span>{' '}
                                 {worker.about}
                              </div>
                              <div className="text-gray-900 col-span-2">
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
                                    variant="outline"
                                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                 >
                                    <Check className="h-4 w-4 mr-1" />
                                    قبول
                                 </Button>
                              )}
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleEdit(worker)}
                                 className="admin-btn-secondary"
                              >
                                 <Edit2 className="h-4 w-4 mr-1" />
                                 تعديل
                              </Button>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleDelete(worker)}
                                 className="admin-btn-danger"
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
                           className="gap-2 admin-btn-secondary"
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
                           className="gap-2 admin-btn-secondary"
                        >
                           التالي
                           <ChevronLeft className="h-4 w-4" />
                        </Button>
                     </div>
                  )}
            </div>
         </AppModal>

         {/* Edit Dialog */}
         <Dialog
            open={!!editingWorker}
            onOpenChange={() => setEditingWorker(null)}
         >
            <DialogContent className="max-w-lg">
               <DialogHeader>
                  <DialogTitle>تعديل بيانات العامل</DialogTitle>
                  <DialogDescription>
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
                              className="admin-input"
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
                              className="admin-input"
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
                           className="admin-input"
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
                           className="admin-input"
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
                           <SelectTrigger className="admin-input">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
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
                           className="admin-btn-secondary"
                        >
                           إلغاء
                        </Button>
                        <Button
                           onClick={saveEdit}
                           disabled={isUpdating}
                           className="admin-btn-primary"
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

         <DeleteConfirmDialog
            open={!!deletingWorker}
            onOpenChange={(open) => !open && setDeletingWorker(null)}
            onConfirm={confirmDelete}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف حساب العامل{' '}
                  <span className="text-foreground font-medium">
                     {deletingWorker?.firstName} {deletingWorker?.lastName}
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
