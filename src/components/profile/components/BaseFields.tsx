'use client';

import { Mail, Phone, MapPin, Cake, Shield, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

export function EmailField({
   email,
   verified,
}: {
   email?: string | null;
   verified: boolean;
}) {
   return (
      <InfoField
         icon={<Mail className="h-5 w-5 text-primary" />}
         title="البريد الإلكتروني"
      >
         <p className="text-muted-foreground">{email}</p>
         {!verified && (
            <p className="text-xs text-yellow-500 mt-2">
               ⚠️ لم يتم تأكيد البريد الإلكتروني
            </p>
         )}
      </InfoField>
   );
}

export function PhoneField({ form, isEditing }: FieldProps) {
   return (
      <InfoField
         icon={<Phone className="h-5 w-5 text-primary" />}
         title="رقم الهاتف"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="phone"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input
                           {...field}
                           placeholder="أدخل رقم الهاتف"
                           className="text-right"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className="text-muted-foreground">
               {(form.getValues('phone') as string) || 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function AddressField({ form, isEditing }: FieldProps) {
   return (
      <InfoField
         icon={<MapPin className="h-5 w-5 text-primary" />}
         title="العنوان"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="address"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input
                           {...field}
                           value={field.value || ''}
                           placeholder="أدخل العنوان"
                           className="text-right"
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         ) : (
            <p className="text-muted-foreground">
               {(form.getValues('address') as string) || 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function BirthDateField({ form, isEditing }: FieldProps) {
   const value = form.getValues('birth_date') as string;

   return (
      <InfoField
         icon={<Cake className="h-5 w-5 text-primary" />}
         title="تاريخ الميلاد"
      >
         {isEditing ? (
            <FormField
               control={form.control}
               name="birth_date"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <Input
                           {...field}
                           value={field.value || ''}
                           type="date"
                           placeholder="اختر تاريخ الميلاد"
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

export function RoleField({ role }: { role?: string }) {
   return (
      <InfoField
         icon={<Shield className="h-5 w-5 text-primary" />}
         title="نوع الحساب"
      >
         <p className="text-muted-foreground">{role}</p>
      </InfoField>
   );
}

export function CreatedAtField({ createdAt }: { createdAt?: string }) {
   return (
      <InfoField
         icon={<Calendar className="h-5 w-5 text-primary" />}
         title="تاريخ الإنشاء"
      >
         <p className="text-muted-foreground">
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'غير متوفر'}
         </p>
      </InfoField>
   );
}
