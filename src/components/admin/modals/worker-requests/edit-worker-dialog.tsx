'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { AppModal } from '@/components/ui/app-modal';
import { ServicesPicker } from '@/components/form-pickers/services-picker';
import { ImageUploadField } from '@/components/image-upload';
import type { ImageUploadState } from '@/components/image-upload';
import { workersApi } from '@/api/admin';
import type { Worker, WorkerStatus } from '@/types/entities/worker';
import type { UpdateWorkerRequest } from '@/types/admin/workers';

const STATUS_OPTIONS: { value: WorkerStatus; label: string }[] = [
   { value: 'waiting', label: 'قيد الانتظار' },
   { value: 'active', label: 'نشط' },
   { value: 'blocked', label: 'محظور' },
];

// ─── Form ────────────────────────────────────────────────────────────────────

interface EditWorkerFormProps {
   worker: Worker;
   onClose: () => void;
   onSave: (id: number, data: UpdateWorkerRequest) => Promise<boolean>;
   isUpdating: boolean;
}

function EditWorkerForm({
   worker,
   onClose,
   onSave,
   isUpdating,
}: EditWorkerFormProps) {
   const [status, setStatus] = useState<WorkerStatus>(worker.status);
   const [serviceIds, setServiceIds] = useState<number[]>(
      worker.services.map((s) => s.id)
   );
   const [yearsExperience, setYearsExperience] = useState(
      worker.years_experience != null ? String(worker.years_experience) : ''
   );
   const [about, setAbout] = useState(worker.about ?? '');

   const [imageState, setImageState] = useState<ImageUploadState>({
      existingImages: worker.images.map((img) => ({
         id: img.id,
         path: img.path,
      })),
      newFiles: [],
      deletedIds: [],
   });
   const [isUploadingImages, setIsUploadingImages] = useState(false);

   const isBusy = isUpdating || isUploadingImages;

   const handleSave = async () => {
      // 1. Delete marked images
      if (imageState.deletedIds.length > 0) {
         await Promise.all(
            imageState.deletedIds.map((id) => workersApi.deleteImage(id))
         );
      }

      // 2. Upload new images
      if (imageState.newFiles.length > 0) {
         setIsUploadingImages(true);
         try {
            await workersApi.uploadImages(worker.id, imageState.newFiles);
         } catch {
            setIsUploadingImages(false);
            return;
         }
         setIsUploadingImages(false);
      }

      // 3. Save worker fields
      const success = await onSave(worker.id, {
         status,
         service_ids: serviceIds,
         years_experience: yearsExperience
            ? Number(yearsExperience)
            : undefined,
         about: about || undefined,
      });

      if (success) onClose();
   };

   return (
      <div className="space-y-5">
         {/* Status */}
         <Field label="الحالة">
            <Select
               value={status}
               onValueChange={(v) => setStatus(v as WorkerStatus)}
            >
               <SelectTrigger className="admin-input">
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
         </Field>

         {/* Services — fixed to worker's career */}
         <Field label={`الخدمات — ${worker.career.name}`}>
            <ServicesPicker
               careerId={worker.career_id}
               value={serviceIds}
               onChange={setServiceIds}
               disabled={isBusy}
               theme="admin"
            />
         </Field>

         {/* Years experience */}
         <Field label="سنوات الخبرة">
            <Input
               type="number"
               min={0}
               value={yearsExperience}
               onChange={(e) => setYearsExperience(e.target.value)}
               placeholder="عدد سنوات الخبرة"
               className="admin-input"
               disabled={isBusy}
            />
         </Field>

         {/* About */}
         <Field label="نبذة عن العامل">
            <Textarea
               value={about}
               onChange={(e) => setAbout(e.target.value)}
               placeholder="نبذة مختصرة..."
               rows={3}
               className="admin-input resize-none"
               disabled={isBusy}
            />
         </Field>

         {/* Images */}
         <Field label="صور الأعمال">
            <ImageUploadField
               state={imageState}
               isEditing
               disabled={isBusy}
               theme="admin"
               config={{
                  imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_URL ?? '',
                  uploadButtonText: 'إضافة صور',
                  uploadHintText:
                     'يمكنك إضافة أكثر من صورة، وستظهر المعاينة هنا قبل الحفظ.',
                  emptyStateText: 'لا توجد صور مضافة حتى الآن',
                  savedLabel: 'صورة محفوظة',
                  pendingDeleteLabel: 'سيتم حذف هذه الصورة عند الحفظ',
                  newFileLabel: 'صورة جديدة',
               }}
               callbacks={{
                  onNewFilesAdd: (files) =>
                     setImageState((prev) => ({
                        ...prev,
                        newFiles: [...prev.newFiles, ...files],
                     })),
                  onNewFileRemove: (index) =>
                     setImageState((prev) => ({
                        ...prev,
                        newFiles: prev.newFiles.filter((_, i) => i !== index),
                     })),
                  onExistingImageDelete: (id) =>
                     setImageState((prev) => ({
                        ...prev,
                        deletedIds: [...prev.deletedIds, id],
                     })),
                  onExistingImageRestore: (id) =>
                     setImageState((prev) => ({
                        ...prev,
                        deletedIds: prev.deletedIds.filter((d) => d !== id),
                     })),
               }}
            />
         </Field>

         {/* Footer actions */}
         <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <Button
               variant="outline"
               onClick={onClose}
               disabled={isBusy}
               className="admin-btn-secondary"
            >
               إلغاء
            </Button>
            <Button
               onClick={handleSave}
               disabled={isBusy}
               className="admin-btn-primary gap-2"
            >
               {isBusy ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                     {isUploadingImages ? 'جاري رفع الصور...' : 'جاري الحفظ...'}
                  </>
               ) : (
                  'حفظ التغييرات'
               )}
            </Button>
         </div>
      </div>
   );
}

// ─── Dialog wrapper ───────────────────────────────────────────────────────────

export interface EditWorkerDialogProps {
   worker: Worker | null;
   onClose: () => void;
   onSave: (id: number, data: UpdateWorkerRequest) => Promise<boolean>;
   isUpdating: boolean;
}

export function EditWorkerDialog({
   worker,
   onClose,
   onSave,
   isUpdating,
}: EditWorkerDialogProps) {
   return (
      <AppModal
         open={!!worker}
         onOpenChange={(open) => !open && onClose()}
         title="تعديل بيانات العامل"
         description={
            worker ? `${worker.user.name} — ${worker.career.name}` : undefined
         }
         size="lg"
         theme="admin"
         showCloseButton={false}
      >
         {worker && (
            <EditWorkerForm
               key={worker.id}
               worker={worker}
               onClose={onClose}
               onSave={onSave}
               isUpdating={isUpdating}
            />
         )}
      </AppModal>
   );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
   label,
   children,
}: {
   label: string;
   children: React.ReactNode;
}) {
   return (
      <div className="space-y-1.5">
         <Label className="text-gray-600 font-medium">{label}</Label>
         {children}
      </div>
   );
}
