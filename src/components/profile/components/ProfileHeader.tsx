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
   const selectedFile = form?.watch('profile_image');

   const previewSrc = useMemo(
      () =>
         selectedFile instanceof File
            ? URL.createObjectURL(selectedFile)
            : null,
      [selectedFile]
   );

   useEffect(
      () => () => {
         if (previewSrc) URL.revokeObjectURL(previewSrc);
      },
      [previewSrc]
   );

   const resolvedStoredImage = useMemo(
      () => resolveImageUrl(profileImage),
      [profileImage]
   );
   const imageSrc = previewSrc ?? resolvedStoredImage;

   return (
      <div className="flex flex-col items-center py-8">
         {/* Avatar */}
         <div className="relative mb-5">
            <div className="w-28 h-28 rounded-full ring-4 ring-primary/20 ring-offset-2 ring-offset-background overflow-hidden shadow-md">
               {imageSrc ? (
                  <Image
                     src={imageSrc}
                     alt={name || 'profile'}
                     fill
                     className="object-cover rounded-full"
                     unoptimized
                  />
               ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                     <User className="h-14 w-14 text-primary" />
                  </div>
               )}
            </div>

            {isEditing && form && (
               <FormField
                  control={form.control}
                  name="profile_image"
                  render={({ field: { onChange } }) => (
                     <FormItem className="absolute bottom-0 left-0">
                        <button
                           type="button"
                           onClick={() => inputRef.current?.click()}
                           className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-lg ring-2 ring-background transition-transform hover:scale-105"
                        >
                           <Camera className="h-4 w-4 text-primary-foreground" />
                        </button>
                        <input
                           ref={inputRef}
                           type="file"
                           accept="image/jpeg,image/png"
                           className="hidden"
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                              e.currentTarget.value = '';
                           }}
                        />
                     </FormItem>
                  )}
               />
            )}
         </div>

         <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
         <p className="text-sm text-muted-foreground mt-1">{email}</p>
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
