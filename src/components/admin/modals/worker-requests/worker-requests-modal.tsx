'use client';

import {
   AlertCircle,
   ChevronLeft,
   ChevronRight,
   Phone,
   RefreshCw,
   Search,
} from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { WorkerCard } from './worker-card';
import { EditWorkerDialog } from './edit-worker-dialog';
import { useWorkerRequests } from './use-worker-requests';
import type { WorkerStatus } from '@/types/entities/worker';
import type { BaseModalProps } from '../base-modal';

const STATUS_OPTIONS: { value: WorkerStatus; label: string }[] = [
   { value: 'waiting', label: 'قيد الانتظار' },
   { value: 'active', label: 'نشط' },
   { value: 'blocked', label: 'محظور' },
];

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
      nameInput,
      setNameInput,
      phoneInput,
      setPhoneInput,
      nextPage,
      prevPage,
      refetch,
      hasNextPage,
      hasPrevPage,
      isUpdating,
      isDeleting,
      updateWorker,
      approveWorker,
      blockWorker,
      editingWorker,
      setEditingWorker,
      deletingWorker,
      setDeletingWorker,
      confirmDelete,
   } = useWorkerRequests(open);

   return (
      <>
         <AppModal
            open={open}
            title="طلبات العمال"
            description={`إدارة طلبات التسجيل (${totalWorkers} عامل)`}
            closeHref="/admin/dashboard"
            closeButtonText="إغلاق"
         >
            <div className="space-y-4">
               {/* Filters */}
               <div className="space-y-3 pb-3 border-b border-gray-200">
                  {/* Status + count */}
                  <div className="flex items-center gap-4">
                     <label className="text-sm text-gray-600">
                        حالة الحساب:
                     </label>
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
                           {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                 {opt.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <span className="text-sm text-gray-500 mr-auto">
                        {totalWorkers} عامل
                     </span>
                  </div>

                  {/* Name + phone search */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                     <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                           value={nameInput}
                           onChange={(e) => setNameInput(e.target.value)}
                           placeholder="بحث بالاسم..."
                           className="admin-input h-10 pr-10"
                        />
                     </div>
                     <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                           value={phoneInput}
                           onChange={(e) => setPhoneInput(e.target.value)}
                           placeholder="بحث برقم الهاتف..."
                           inputMode="tel"
                           className="admin-input h-10 pr-10"
                        />
                     </div>
                  </div>
               </div>

               {/* Loading */}
               {isLoading && (
                  <LoadingState
                     message="جاري تحميل بيانات العمال..."
                     size="lg"
                  />
               )}

               {/* Error */}
               {!isLoading && error && (
                  <EmptyState
                     icon={
                        <AlertCircle className="h-12 w-12 text-destructive" />
                     }
                     title="حدث خطأ"
                     description={error.message ?? 'حدث خطأ غير متوقع'}
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
               )}

               {/* Empty */}
               {!isLoading && !error && workers.length === 0 && (
                  <EmptyState
                     icon={<AlertCircle className="h-12 w-12" />}
                     title="لا يوجد عمال"
                     description="لا يوجد عمال في هذه الفئة حالياً"
                  />
               )}

               {/* Workers List */}
               {!isLoading && !error && workers.length > 0 && (
                  <div className="grid gap-4">
                     {workers.map((worker) => (
                        <WorkerCard
                           key={worker.id}
                           worker={worker}
                           isUpdating={isUpdating}
                           onApprove={approveWorker}
                           onBlock={blockWorker}
                           onEdit={setEditingWorker}
                           onDelete={setDeletingWorker}
                        />
                     ))}
                  </div>
               )}

               {/* Pagination */}
               {!isLoading &&
                  !error &&
                  workers.length > 0 &&
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

         <EditWorkerDialog
            worker={editingWorker}
            onClose={() => setEditingWorker(null)}
            onSave={updateWorker}
            isUpdating={isUpdating}
         />

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
                     {deletingWorker?.user.name}
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
