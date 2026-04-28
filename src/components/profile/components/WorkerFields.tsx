'use client';

import { Award, Briefcase, FileText, ImagePlus, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { InfoField } from '@/components/sections/info-field';
import { ServicesPicker } from '@/components/publicComponents/services-picker';
import { ImageUploadField } from '@/components/image-upload';
import type { UseFormReturn } from 'react-hook-form';
import type { WorkerInfoFormData } from '@/components/profile/schemas';
import type { Worker } from '@/types/entities/worker';
import usePublicDataStore from '@/stores/public-data';

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

export function CareerField({ worker }: { worker?: Worker | null }) {
   const careerId = worker?.career_id ?? null;
   const careerName = usePublicDataStore(
      (state) => state.careerCache?.careers.find((c) => c.id === careerId)?.name
   );
   return (
      <InfoField
         icon={<Briefcase className="h-5 w-5 text-primary" />}
         title="التخصص"
      >
         <p className="text-muted-foreground">
            {careerName || worker?.career?.name || 'غير محدد'}
         </p>
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
                     className="rounded-md bg-primary/10 px-2 py-1 text-primary"
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
         <p className={`font-medium ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
         </p>
      </InfoField>
   );
}

export function WorkerImagesField({ form, isEditing, worker }: FieldProps) {
   const existingImages = worker?.images ?? [];
   const deletedIds = form.watch('delete_images') ?? [];
   const newFiles = form.watch('worker_images') ?? [];

   return (
      <InfoField
         icon={<ImagePlus className="h-5 w-5 text-primary" />}
         title="صور الأعمال"
         className="md:col-span-2"
      >
         <ImageUploadField
            state={{
               existingImages,
               newFiles,
               deletedIds,
            }}
            callbacks={{
               onNewFilesAdd: (files) =>
                  form.setValue('worker_images', [...newFiles, ...files], {
                     shouldDirty: true,
                     shouldTouch: true,
                     shouldValidate: true,
                  }),
               onNewFileRemove: (index) => {
                  const updated = newFiles.filter((_, i) => i !== index);
                  form.setValue('worker_images', updated, {
                     shouldDirty: true,
                     shouldTouch: true,
                     shouldValidate: true,
                  });
               },
               onExistingImageDelete: (id) => {
                  form.setValue('delete_images', [...deletedIds, id], {
                     shouldDirty: true,
                     shouldTouch: true,
                  });
               },
               onExistingImageRestore: (id) => {
                  form.setValue(
                     'delete_images',
                     deletedIds.filter((deletedId) => deletedId !== id),
                     {
                        shouldDirty: true,
                        shouldTouch: true,
                     }
                  );
               },
            }}
            config={{
               imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_URL || '',
            }}
            isEditing={isEditing}
            disabled={!isEditing}
         />
      </InfoField>
   );
}
