'use client';

import {
   Award,
   Briefcase,
   Clock,
   FileText,
   ImagePlus,
   Wrench,
   X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { InfoField } from '@/components/sections/info-field';
import { ServicesPicker } from '@/components/publicComponents/services-picker';
// import { storageUrl } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { WorkerInfoFormData } from '@/components/profile/schemas';
import type { Worker } from '@/types/entities/worker';
import Image from 'next/image';

interface FieldProps {
   form: UseFormReturn<WorkerInfoFormData>;
   isEditing: boolean;
   worker?: Worker | null;
}

const STATUS_LABELS: Record<string, string> = {
   active: 'نشط',
   waiting: 'قيد المراجعة',
   blocked: 'موقوف',
};

const STATUS_COLORS: Record<string, string> = {
   active: 'text-green-600',
   waiting: 'text-yellow-600',
   blocked: 'text-red-600',
};

function buildFileKey(file: File) {
   return `${file.name}-${file.size}-${file.lastModified}`;
}

export function CareerField({ worker }: { worker?: Worker | null }) {
   const careerName = worker?.career?.name ?? null;
   return (
      <InfoField
         icon={<Briefcase className="h-5 w-5 text-primary" />}
         title="التخصص"
      >
         <p className="text-muted-foreground">{careerName || 'غير محدد'}</p>
      </InfoField>
   );
}

export function ServicesField({ form, isEditing, worker }: FieldProps) {
   const careerId = worker?.career_id ?? null;
   const services = worker?.services ?? [];

   return (
      <InfoField
         icon={<Wrench className="h-5 w-5 text-primary" />}
         title="الخدمات"
         className="md:col-span-2"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="services"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <ServicesPicker
                           careerId={careerId}
                           value={field.value ?? []}
                           onChange={field.onChange}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : services.length === 0 ? (
            <p className="text-muted-foreground">لا توجد خدمات</p>
         ) : (
            <div className="flex flex-wrap gap-2">
               {services.map((service) => (
                  <span
                     key={service.id}
                     className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                     {service.name}
                  </span>
               ))}
            </div>
         )}
      </InfoField>
   );
}

export function AboutField({ form, isEditing, worker }: FieldProps) {
   return (
      <InfoField
         icon={<FileText className="h-5 w-5 text-primary" />}
         title="نبذة عن الفني"
         className="md:col-span-2"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="about"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Textarea
                           {...field}
                           value={field.value || ''}
                           placeholder="اكتب نبذة عن خبراتك ومهاراتك..."
                           className="min-h-24 text-right"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className="text-muted-foreground">
               {worker?.about || 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function YearsExperienceField({ form, isEditing, worker }: FieldProps) {
   return (
      <InfoField
         icon={<Award className="h-5 w-5 text-primary" />}
         title="سنوات الخبرة"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="years_experience"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input
                           {...field}
                           value={field.value || ''}
                           placeholder="عدد سنوات الخبرة"
                           className="text-right"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className="text-muted-foreground">
               {worker?.years_experience != null
                  ? `${worker.years_experience} سنة`
                  : 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function AccountStatusField({ form, isEditing, worker }: FieldProps) {
   const status = worker?.status ?? 'waiting';

   return (
      <InfoField
         icon={<Briefcase className="h-5 w-5 text-primary" />}
         title="حالة الحساب"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="account_status"
               render={({ field }) => (
                  <FormItem>
                     <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                     >
                        <FormControl>
                           <SelectTrigger className="text-right">
                              <SelectValue placeholder="اختر حالة الحساب" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="active">نشط</SelectItem>
                           <SelectItem value="waiting">قيد المراجعة</SelectItem>
                           <SelectItem value="blocked">موقوف</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className={`font-medium ${STATUS_COLORS[status]}`}>
               {STATUS_LABELS[status]}
            </p>
         )}
      </InfoField>
   );
}

export function NearlyDateField({
   form,
   isEditing,
}: Omit<FieldProps, 'worker'>) {
   return (
      <InfoField
         icon={<Clock className="h-5 w-5 text-primary" />}
         title="أقرب موعد متاح"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="nearly_date"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input
                           {...field}
                           value={field.value || ''}
                           type="number"
                           placeholder="اختر أقرب موعد متاح مثال 3 أيام"
                           className="text-right"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className="text-muted-foreground">غير متوفر</p>
         )}
      </InfoField>
   );
}

function NewImagePreview({
   file,
   onRemove,
}: {
   file: File;
   onRemove: () => void;
}) {
   const [url] = useState(() => URL.createObjectURL(file));
   const cleanup = useRef(() => URL.revokeObjectURL(url));

   useEffect(() => cleanup.current, []);

   return (
      <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70 bg-muted">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
            src={url}
            alt={file.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
         />
         <button
            type="button"
            onClick={onRemove}
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-md"
         >
            <X className="h-3.5 w-3.5" />
         </button>
         <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-xs text-white">
            صورة جديدة
         </div>
      </div>
   );
}

export function WorkerImagesField({ form, isEditing, worker }: FieldProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const existingImages = worker?.images ?? [];
   const deletedIds = form.watch('delete_images') ?? [];
   const newFiles = form.watch('worker_images') ?? [];
   const visibleExistingImages = existingImages.filter(
      (image) => !deletedIds.includes(image.id)
   );
   const hasImages = visibleExistingImages.length > 0 || newFiles.length > 0;

   const toggleDelete = (id: number) => {
      const current = form.getValues('delete_images') ?? [];
      form.setValue(
         'delete_images',
         current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id],
         { shouldDirty: true, shouldTouch: true }
      );
   };

   const handleNewFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
      const pickedFiles = Array.from(event.target.files ?? []).filter((file) =>
         file.type.startsWith('image/')
      );

      if (pickedFiles.length === 0) {
         event.target.value = '';
         return;
      }

      const seenFiles = new Set(newFiles.map(buildFileKey));
      const mergedFiles = [...newFiles];

      pickedFiles.forEach((file) => {
         const key = buildFileKey(file);
         if (!seenFiles.has(key)) {
            seenFiles.add(key);
            mergedFiles.push(file);
         }
      });

      form.setValue('worker_images', mergedFiles, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      });

      event.target.value = '';
   };

   const removeNewFile = (index: number) => {
      form.setValue(
         'worker_images',
         newFiles.filter((_, fileIndex) => fileIndex !== index),
         { shouldDirty: true, shouldTouch: true, shouldValidate: true }
      );
   };

   return (
      <InfoField
         icon={<ImagePlus className="h-5 w-5 text-primary" />}
         title="صور الأعمال"
         className="md:col-span-2"
      >
         <div className="space-y-5">
            {!hasImages && (
               <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                  لا توجد صور أعمال مضافة حتى الآن
               </div>
            )}

            {hasImages && (
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {existingImages.map((image) => {
                     const markedForDelete = deletedIds.includes(image.id);

                     return (
                        <div
                           key={image.id}
                           className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/70 bg-muted"
                        >
                           <Image
                              src={
                                 process.env.NEXT_PUBLIC_IMAGE_URL + image.path
                              }
                              alt=""
                              width={'45'}
                              height={'45'}
                              unoptimized
                              className={`h-full w-full object-cover transition duration-200 group-hover:scale-[1.02] ${markedForDelete ? 'opacity-20 grayscale' : ''}`}
                           />

                           <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-xs text-white">
                              {markedForDelete
                                 ? 'سيتم حذف هذه الصورة عند الحفظ'
                                 : 'صورة محفوظة'}
                           </div>
                           {isEditing && (
                              <button
                                 type="button"
                                 onClick={() => toggleDelete(image.id)}
                                 className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-colors ${markedForDelete ? 'bg-green-600' : 'bg-destructive'}`}
                              >
                                 <X className="h-3.5 w-3.5" />
                              </button>
                           )}
                        </div>
                     );
                  })}

                  {isEditing &&
                     newFiles.map((file, index) => (
                        <NewImagePreview
                           key={buildFileKey(file)}
                           file={file}
                           onRemove={() => removeNewFile(index)}
                        />
                     ))}
               </div>
            )}

            {isEditing && (
               <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
                  <button
                     type="button"
                     onClick={() => inputRef.current?.click()}
                     className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-background px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                  >
                     <ImagePlus className="h-4 w-4" />
                     اختيار صور متعددة
                  </button>
                  <p className="mt-2 text-sm text-muted-foreground">
                     يمكنك اختيار أكثر من صورة دفعة واحدة، وستظهر المعاينة هنا
                     قبل الحفظ.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                     الصور الجديدة: {newFiles.length} | الصور الحالية:{' '}
                     {visibleExistingImages.length}
                  </p>
                  <input
                     ref={inputRef}
                     type="file"
                     accept="image/jpg,image/jpeg,image/png"
                     multiple
                     className="hidden"
                     onChange={handleNewFiles}
                  />
               </div>
            )}
         </div>
      </InfoField>
   );
}
