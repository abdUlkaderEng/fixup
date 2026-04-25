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
import type { BaseProfileFormData } from '@/components/profile/schemas';
import type { User } from 'next-auth';
import { MapPicker } from '@/components/map-picker';
import { usePublicAreas } from '@/hooks/public/use-public-areas';
import AreaSelect from '@/components/publicComponents/area-select';

interface FieldProps {
   form: UseFormReturn<BaseProfileFormData>;
   isEditing: boolean;
   user: User;
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

export function PhoneField({ form, isEditing, user }: FieldProps) {
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
               {user.phone_number || 'غير متوفر'}
            </p>
         )}
      </InfoField>
   );
}

export function AddressField({ form, isEditing, user }: FieldProps) {
   const areaName = user.address?.area_address?.area_name ?? null;
   const areaId = user.area_address_id;
   const lat = user.latitude ? parseFloat(user.latitude) : null;
   const lng = user.longitude ? parseFloat(user.longitude) : null;

   return (
      <InfoField
         icon={<MapPin className="h-5 w-5 text-primary" />}
         title="العنوان"
      >
         {isEditing ? (
            <div className="space-y-3">
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

               <FormField
                  control={form.control}
                  name="area_address_id"
                  render={({ field }) => (
                     <FormItem>
                        <AreaSelect
                           value={field.value ?? null}
                           onChange={(v) => field.onChange(v ?? 0)}
                        />
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                     <div>
                        <MapPicker
                           mapTilerKey={process.env.NEXT_PUBLIC_MAPTILER_KEY!}
                           initialLng={
                              Number(form.getValues('longitude')) || lng || 0
                           }
                           initialLat={
                              Number(form.getValues('latitude')) || lat || 0
                           }
                           onLocationSelect={(lngVal, latVal) => {
                              form.setValue('latitude', latVal);
                              form.setValue('longitude', lngVal);
                           }}
                        />
                        <FormMessage />
                     </div>
                  )}
               />
            </div>
         ) : (
            <div className="space-y-3">
               <p className="text-muted-foreground">
                  {user.detailed_address || 'غير متوفر'}
               </p>
               {(areaName || areaId) && (
                  <p className="text-xs text-muted-foreground">
                     منطقة: {areaName ?? areaId}
                  </p>
               )}
               {lat && lng && (
                  <div>
                     <div className="mb-2 text-xs text-muted-foreground">
                        إحداثيات:
                     </div>
                     <MapPicker
                        mapTilerKey={process.env.NEXT_PUBLIC_MAPTILER_KEY!}
                        initialLng={lng}
                        initialLat={lat}
                        readOnly
                     />
                  </div>
               )}
            </div>
         )}
      </InfoField>
   );
}

export function BirthDateField({ form, isEditing, user }: FieldProps) {
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
               {user.birth_date
                  ? new Date(user.birth_date).toLocaleDateString()
                  : 'غير متوفر'}
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
