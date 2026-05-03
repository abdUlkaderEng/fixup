'use client';

import { ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageUploadThemeTokens } from '../types';

interface UploadZoneProps {
   inputRef: React.RefObject<HTMLInputElement | null>;
   onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
   tokens: ImageUploadThemeTokens;
   buttonText?: string;
   hintText?: string;
   statsText?: string;
   accept?: string;
   multiple?: boolean;
}

export function UploadZone({
   inputRef,
   onFileSelect,
   tokens,
   buttonText = 'اختيار صور متعددة',
   hintText = 'يمكنك اختيار أكثر من صورة دفعة واحدة، وستظهر المعاينة هنا قبل الحفظ.',
   statsText,
   accept = 'image/jpg,image/jpeg,image/png',
   multiple = true,
}: UploadZoneProps) {
   return (
      <div
         className={cn(
            'rounded-xl border border-dashed p-4',
            tokens.zoneWrapper
         )}
      >
         <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
               'flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
               tokens.zoneButton
            )}
         >
            <ImagePlus className="h-4 w-4" />
            {buttonText}
         </button>
         <p className={cn('mt-2 text-sm', tokens.zoneHint)}>{hintText}</p>
         {statsText && (
            <p className={cn('mt-1 text-xs', tokens.zoneHint)}>{statsText}</p>
         )}
         <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={onFileSelect}
         />
      </div>
   );
}
