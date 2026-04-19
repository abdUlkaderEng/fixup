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
               name="phone_number"
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
               {(form.getValues('phone_number') as string) || 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function AddressField({ form, isEditing }: FieldProps) {
   const detailedAddress = form.getValues('detailed_address');
   const areaId = form.getValues('area_address_id');
   const lat = form.getValues('latitude');
   const lng = form.getValues('longitude');

   return (
      <InfoField
         icon={<MapPin className="h-5 w-5 text-primary" />}
         title="العنوان"
      >
         {isEditing ? (
            <div className="space-y-2">
               <FormField
                  control={form.control}
                  name="detailed_address"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input
                              {...field}
                              value={field.value || ''}
                              placeholder="العنوان التفصيلي"
                              className="text-right"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="grid grid-cols-2 gap-2">
                  <FormField
                     control={form.control}
                     name="area_address_id"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 {...field}
                                 value={field.value || ''}
                                 type="number"
                                 placeholder="معرف المنطقة"
                                 className="text-right"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <FormField
                     control={form.control}
                     name="latitude"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 {...field}
                                 value={field.value || ''}
                                 type="number"
                                 step="any"
                                 placeholder="خط العرض"
                                 className="text-right"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="longitude"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 {...field}
                                 value={field.value || ''}
                                 type="number"
                                 step="any"
                                 placeholder="خط الطول"
                                 className="text-right"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </div>
         ) : (
            <div className="space-y-1">
               <p className="text-muted-foreground">
                  {detailedAddress || 'غير متوفر'}
               </p>
               {areaId && (
                  <p className="text-xs text-muted-foreground">
                     منطقة: {areaId}
                  </p>
               )}
               {lat && lng && (
                  <p className="text-xs text-muted-foreground">
                     الإحداثيات: {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
               )}
            </div>
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
