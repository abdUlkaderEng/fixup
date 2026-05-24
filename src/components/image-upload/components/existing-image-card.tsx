'use client';

import Image from 'next/image';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExistingImage, ImageUploadThemeTokens } from '../types';

interface ExistingImageCardProps {
   image: ExistingImage;
   isMarkedForDelete: boolean;
   imageBaseUrl: string;
   tokens: ImageUploadThemeTokens;
   savedLabel?: string;
   pendingDeleteLabel?: string;
   onToggleDelete: () => void;
   isEditing: boolean;
}

export function ExistingImageCard({
   image,
   isMarkedForDelete,
   imageBaseUrl,
   tokens,
   savedLabel = 'صورة محفوظة',
   pendingDeleteLabel = 'سيتم حذف هذه الصورة عند الحفظ',
   onToggleDelete,
   isEditing,
}: ExistingImageCardProps) {
   return (
      <div
         className={cn(
            'group relative aspect-4/3 overflow-hidden rounded-xl border',
            tokens.cardBorder
         )}
      >
         <Image
            src={imageBaseUrl + image.path}
            alt=""
            width={45}
            height={45}
            unoptimized
            className={cn(
               'h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]',
               isMarkedForDelete && 'opacity-20 grayscale'
            )}
         />

         <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-xs text-white">
            {isMarkedForDelete ? pendingDeleteLabel : savedLabel}
         </div>

         {isEditing && (
            <button
               type="button"
               onClick={onToggleDelete}
               className={cn(
                  'absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-colors',
                  isMarkedForDelete
                     ? 'bg-green-600 hover:bg-green-700'
                     : 'bg-destructive hover:bg-destructive/90'
               )}
            >
               {isMarkedForDelete ? (
                  <RotateCcw className="h-3.5 w-3.5" />
               ) : (
                  <X className="h-3.5 w-3.5" />
               )}
            </button>
         )}
      </div>
   );
}
