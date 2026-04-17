'use client';

import React, { useState } from 'react';
import {
   Check,
   X,
   Edit2,
   Trash2,
   UserCheck,
   Clock,
   AlertCircle,
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
import {
   WORKER_SERVICES,
   WORKER_EXPERIENCE_LEVELS,
} from '@/lib/admin/mock-data';

interface PendingWorker {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   service: string;
   experience: string;
   bio: string;
   idNumber: string;
   status: 'waiting' | 'active';
   requestDate: string;
   documents: {
      idCard: boolean;
      certificate: boolean;
      backgroundCheck: boolean;
   };
}

const MOCK_PENDING_WORKERS: PendingWorker[] = [
   {
      id: 'WORK-REQ-001',
      firstName: 'محمد',
      lastName: 'أحمد',
      email: 'mohamed.ahmed@email.com',
      phone: '+966 50 123 4567',
      service: 'إصلاح السباكة',
      experience: 'intermediate',
      bio: 'خبير في أعمال السباكة مع 5 سنوات خبرة',
      idNumber: '1234567890',
      status: 'waiting',
      requestDate: '2024-01-20',
      documents: { idCard: true, certificate: true, backgroundCheck: true },
   },
   {
      id: 'WORK-REQ-002',
      firstName: 'خالد',
      lastName: 'عمر',
      email: 'khaled.omar@email.com',
      phone: '+966 55 987 6543',
      service: 'أعمال الكهرباء',
      experience: 'expert',
      bio: 'فني كهرباء معتمد مع 10 سنوات خبرة',
      idNumber: '0987654321',
      status: 'waiting',
      requestDate: '2024-01-19',
      documents: { idCard: true, certificate: false, backgroundCheck: true },
   },
   {
      id: 'WORK-REQ-003',
      firstName: 'فاطمة',
      lastName: 'حسن',
      email: 'fatima.hassan@email.com',
      phone: '+966 54 456 7890',
      service: 'تنظيف المنزل',
      experience: 'beginner',
      bio: 'أسعى لتقديم خدمات تنظيف ممتازة',
      idNumber: '1122334455',
      status: 'waiting',
      requestDate: '2024-01-18',
      documents: { idCard: true, certificate: false, backgroundCheck: false },
   },
];

/**
 * Worker Requests Modal
 * Shows pending worker requests with approve/edit/delete actions
 */
export function WorkerRequestsModal({ open }: BaseModalProps) {
   const [workers, setWorkers] =
      useState<PendingWorker[]>(MOCK_PENDING_WORKERS);
   const [editingWorker, setEditingWorker] = useState<PendingWorker | null>(
      null
   );
   const [deletingWorker, setDeletingWorker] = useState<PendingWorker | null>(
      null
   );

   const handleApprove = (workerId: string) => {
      setWorkers((prev) =>
         prev.map((w) => (w.id === workerId ? { ...w, status: 'active' } : w))
      );
   };

   const handleDelete = (worker: PendingWorker) => {
      setDeletingWorker(worker);
   };

   const confirmDelete = () => {
      if (deletingWorker) {
         setWorkers((prev) => prev.filter((w) => w.id !== deletingWorker.id));
         setDeletingWorker(null);
      }
   };

   const handleEdit = (worker: PendingWorker) => {
      setEditingWorker({ ...worker });
   };

   const saveEdit = () => {
      if (editingWorker) {
         setWorkers((prev) =>
            prev.map((w) => (w.id === editingWorker.id ? editingWorker : w))
         );
         setEditingWorker(null);
      }
   };

   const pendingCount = workers.filter((w) => w.status === 'waiting').length;

   return (
      <>
         <AdminModal
            open={open}
            title="طلبات العمال"
            description={`إدارة طلبات التسجيل (${pendingCount} قيد الانتظار)`}
            className="max-w-4xl"
         >
            <div className="space-y-4">
               {workers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>لا توجد طلبات عمال حالياً</p>
                  </div>
               ) : (
                  <div className="grid gap-4">
                     {workers.map((worker) => (
                        <div
                           key={worker.id}
                           className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                        >
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                                    {worker.firstName[0]}
                                    {worker.lastName[0]}
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
                                 <span className="text-gray-400">الهاتف:</span>{' '}
                                 {worker.phone}
                              </div>
                              <div className="text-gray-600">
                                 <span className="text-gray-400">الخبرة:</span>{' '}
                                 {WORKER_EXPERIENCE_LEVELS.find(
                                    (l) => l.value === worker.experience
                                 )?.label || worker.experience}
                              </div>
                              <div className="text-gray-600">
                                 <span className="text-gray-400">
                                    تاريخ الطلب:
                                 </span>{' '}
                                 {worker.requestDate}
                              </div>
                           </div>

                           {worker.status === 'waiting' && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                                 <span>المستندات:</span>
                                 <span
                                    className={
                                       worker.documents.idCard
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                    }
                                 >
                                    الهوية {worker.documents.idCard ? '✓' : '✗'}
                                 </span>
                                 <span
                                    className={
                                       worker.documents.certificate
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                    }
                                 >
                                    الشهادة{' '}
                                    {worker.documents.certificate ? '✓' : '✗'}
                                 </span>
                                 <span
                                    className={
                                       worker.documents.backgroundCheck
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                    }
                                 >
                                    فحص الخلفية{' '}
                                    {worker.documents.backgroundCheck
                                       ? '✓'
                                       : '✗'}
                                 </span>
                              </div>
                           )}

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
                              value={editingWorker.firstName}
                              onChange={(e) =>
                                 setEditingWorker((prev) =>
                                    prev
                                       ? { ...prev, firstName: e.target.value }
                                       : null
                                 )
                              }
                              className="bg-white border-gray-300 text-gray-900"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-gray-600">اسم العائلة</Label>
                           <Input
                              value={editingWorker.lastName}
                              onChange={(e) =>
                                 setEditingWorker((prev) =>
                                    prev
                                       ? { ...prev, lastName: e.target.value }
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
                           value={editingWorker.email}
                           onChange={(e) =>
                              setEditingWorker((prev) =>
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
                           value={editingWorker.phone}
                           onChange={(e) =>
                              setEditingWorker((prev) =>
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
                           value={editingWorker.service}
                           onValueChange={(value) =>
                              setEditingWorker((prev) =>
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
                           className="bg-gray-900 text-white hover:bg-gray-800"
                        >
                           حفظ التغييرات
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
                     className="bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  >
                     <Trash2 className="h-4 w-4 mr-1" />
                     حذف الحساب
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
