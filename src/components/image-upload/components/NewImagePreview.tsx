'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface NewImagePreviewProps {
   file: File;
   onRemove: () => void;
   label?: string;
}

export function NewImagePreview({
   file,
   onRemove,
   label = 'صورة جديدة',
}: NewImagePreviewProps) {
   const [url] = useState(() => URL.createObjectURL(file));
   const cleanup = useRef(() => URL.revokeObjectURL(url));

   useEffect(() => cleanup.current, []);

   return (
      <div className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border/70 bg-muted">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
            src={url}
            alt={file.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
         />
         <button
            type="button"
            onClick={onRemove}
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-md"
         >
            <X className="h-3.5 w-3.5" />
         </button>
         <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent px-3 py-2 text-xs text-white">
            {label}
         </div>
      </div>
   );
}
