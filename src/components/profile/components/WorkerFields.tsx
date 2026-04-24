'use client';

import { Briefcase, Clock, Award, FileText, Wrench } from 'lucide-react';
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
   FormField,
   FormControl,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { InfoField } from '@/components/sections/info-field';
import type { UseFormReturn } from 'react-hook-form';
import type { UnifiedProfileFormData } from '@/components/profile/schemas';
import type { Worker } from '@/types/entities/worker';

interface FieldProps {
   form: UseFormReturn<UnifiedProfileFormData>;
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
   return (
      <InfoField
         icon={<Briefcase className="h-5 w-5 text-primary" />}
         title="التخصص"
      >
         <p className="text-muted-foreground">
            {worker?.career?.name || 'غير محدد'}
         </p>
      </InfoField>
   );
}

export function ServicesField({ worker }: { worker?: Worker | null }) {
   const services = worker?.services ?? [];
   return (
      <InfoField
         icon={<Wrench className="h-5 w-5 text-primary" />}
         title="الخدمات"
         className="md:col-span-2"
      >
         {services.length === 0 ? (
            <p className="text-muted-foreground">لا توجد خدمات</p>
         ) : (
            <div className="flex flex-wrap gap-2">
               {services.map((s) => (
                  <span
                     key={s.id}
                     className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                  >
                     {s.name}
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
                           className="text-right min-h-24"
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
                           type="date"
                           placeholder="اختر أقرب موعد متاح"
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
