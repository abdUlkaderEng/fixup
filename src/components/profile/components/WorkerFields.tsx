'use client';

import { Briefcase, Clock, Award, FileText } from 'lucide-react';
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

interface FieldProps {
   form: UseFormReturn<UnifiedProfileFormData>;
   isEditing: boolean;
}

const ACCOUNT_STATUS_LABELS: Record<string, string> = {
   active: 'نشط',
   pending: 'قيد المراجعة',
   suspended: 'موقوف',
};

const ACCOUNT_STATUS_COLORS: Record<string, string> = {
   active: 'text-green-600',
   pending: 'text-yellow-600',
   suspended: 'text-red-600',
};

export function AboutField({ form, isEditing }: FieldProps) {
   const value = form.getValues('about') as string;

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
            <p className="text-muted-foreground">{value || 'غير متوفر'}</p>
         )}
      </InfoField>
   );
}

export function NearlyDateField({ form, isEditing }: FieldProps) {
   const value = form.getValues('nearly_date') as string;

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
            <p className="text-muted-foreground">
               {value ? new Date(value).toLocaleDateString() : 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function YearsExperienceField({ form, isEditing }: FieldProps) {
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
               {(form.getValues('years_experience') as string) || 'غير متوفر'}{' '}
               سنة
            </p>
         )}
      </InfoField>
   );
}

export function AccountStatusField({ form, isEditing }: FieldProps) {
   const value = (form.getValues('account_status') as string) || 'pending';

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
                           <SelectItem value="pending">قيد المراجعة</SelectItem>
                           <SelectItem value="suspended">موقوف</SelectItem>
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className={`font-medium ${ACCOUNT_STATUS_COLORS[value]}`}>
               {ACCOUNT_STATUS_LABELS[value]}
            </p>
         )}
      </InfoField>
   );
}
