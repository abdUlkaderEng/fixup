'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Camera, Star } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BaseProfileFormData } from '@/components/profile/schemas';
import { FormField, FormItem } from '@/components/ui/form';
import { resolveImageUrl } from '@/lib/resolve-image-url';
import { cn } from '@/lib/utils';
import { useWorkerRating } from '@/hooks';

interface ProfileHeaderProps {
   name?: string | null;
   email?: string | null;
   profileImage?: string | null;
   form?: UseFormReturn<BaseProfileFormData>;
   isEditing?: boolean;
   /** When set (worker profiles), shows the worker's rating under the avatar. */
   workerId?: number | null;
}

/**
 * Worker rating pill shown under the avatar: five stars filled to the average,
 * the numeric average, and the total count. Pulses while loading and shows a
 * muted "no ratings yet" state when the worker has none.
 */
function WorkerRatingBadge({ workerId }: { workerId: number }) {
   const { rating, isLoading } = useWorkerRating(workerId);

   if (isLoading) {
      return (
         <div className="mt-4 h-8 w-40 animate-pulse rounded-full bg-muted" />
      );
   }

   const average = rating?.average_rating ?? 0;
   const count = rating?.ratings_count ?? 0;
   const hasRatings = count > 0;

   return (
      <div
         className={cn(
            'mt-4 inline-flex items-center gap-2 rounded-full  px-4 py-1.5 '
         )}
      >
         <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
               <Star
                  key={star}
                  className={cn(
                     'h-4 w-4',
                     hasRatings && star <= Math.round(average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted-foreground/15 text-muted-foreground/30'
                  )}
               />
            ))}
         </div>
         {hasRatings ? (
            <>
               <span className="text-sm font-bold text-amber-700">
                  {average.toFixed(1)}
               </span>
               <span className="text-xs text-amber-600/70">
                  ({count} تقييم)
               </span>
            </>
         ) : (
            <span className="text-xs font-medium text-muted-foreground">
               لا توجد تقييمات بعد
            </span>
         )}
      </div>
   );
}

export function ProfileHeader({
   name,
   email,
   profileImage,
   form,
   isEditing,
   workerId,
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

   useEffect(() => {
      if (!isEditing) {
         form?.setValue('profile_image', undefined, { shouldDirty: false });
      }
   }, [isEditing, form]);

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
                           accept="image/jpeg,image/png,image/jpg"
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

         {workerId != null && <WorkerRatingBadge workerId={workerId} />}
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
