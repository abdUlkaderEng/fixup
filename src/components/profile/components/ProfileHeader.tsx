'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Camera } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BaseProfileFormData } from '@/components/profile/schemas';
import { FormField, FormItem } from '@/components/ui/form';
import { resolveImageUrl } from '@/lib/resolve-image-url';

interface ProfileHeaderProps {
   name?: string | null;
   email?: string | null;
   profileImage?: string | null;
   form?: UseFormReturn<BaseProfileFormData>;
   isEditing?: boolean;
}

export function ProfileHeader({
   name,
   email,
   profileImage,
   form,
   isEditing,
}: ProfileHeaderProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const selectedFile = form?.watch('profile_picture');
   const previewSrc = useMemo(
      () =>
         selectedFile instanceof File
            ? URL.createObjectURL(selectedFile)
            : null,
      [selectedFile]
   );

   useEffect(
      () => () => {
         if (previewSrc) {
            URL.revokeObjectURL(previewSrc);
         }
      },
      [previewSrc]
   );

   const resolvedStoredImage = useMemo(
      () => resolveImageUrl(profileImage),
      [profileImage]
   );
   const imageSrc = previewSrc ?? resolvedStoredImage;

   return (
      <div className="mb-8">
         <div className="relative w-24 h-24 mx-auto mb-4">
            {imageSrc ? (
               <Image
                  src={imageSrc}
                  alt={name || 'profile'}
                  fill
                  className="rounded-full object-cover"
                  unoptimized
               />
            ) : (
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
               </div>
            )}

            {isEditing && form && (
               <FormField
                  control={form.control}
                  name="profile_picture"
                  render={({ field: { onChange } }) => (
                     <FormItem className="absolute bottom-0 left-0">
                        <button
                           type="button"
                           onClick={() => inputRef.current?.click()}
                           className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow"
                        >
                           <Camera className="h-4 w-4 text-primary-foreground" />
                        </button>
                        <input
                           ref={inputRef}
                           type="file"
                           accept="image/jpg,image/jpeg,image/png"
                           className="hidden"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                 onChange(file);
                              }

                              // Allow re-selecting the same file.
                              e.currentTarget.value = '';
                           }}
                        />
                     </FormItem>
                  )}
               />
            )}
         </div>

         <h1 className="text-3xl font-bold text-center mb-2">{name}</h1>
         <p className="text-muted-foreground text-center">{email}</p>
      </div>
   );
}

interface BackLinkProps {
   href: string;
   label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
   return (
      <Link
         href={href}
         className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
         <ArrowLeft className="h-4 w-4" />
         <span>{label}</span>
      </Link>
   );
}
