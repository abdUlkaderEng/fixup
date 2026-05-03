'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageUploadThemeTokens } from '../types';

interface NewImagePreviewProps {
   file: File;
   onRemove: () => void;
   tokens: ImageUploadThemeTokens;
   label?: string;
}

export function NewImagePreview({
   file,
   onRemove,
   tokens,
   label = 'صورة جديدة',
}: NewImagePreviewProps) {
   const [url] = useState(() => URL.createObjectURL(file));
   const cleanup = useRef(() => URL.revokeObjectURL(url));

   useEffect(() => cleanup.current, []);

   return (
      <div
         className={cn(
            'group relative aspect-4/3 overflow-hidden rounded-xl border',
            tokens.cardBorder
         )}
      >
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
            src={url}
            alt={file.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
         />
         <button
            type="button"
            onClick={onRemove}
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive hover:bg-destructive/90 text-white shadow-md transition-colors"
         >
            <X className="h-3.5 w-3.5" />
         </button>
         <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-xs text-white">
            {label}
         </div>
      </div>
   );
}
