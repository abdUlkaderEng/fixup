'use client';

import { ImagePlus } from 'lucide-react';

interface UploadZoneProps {
   inputRef: React.RefObject<HTMLInputElement | null>;
   onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
   buttonText?: string;
   hintText?: string;
   statsText?: string;
   accept?: string;
   multiple?: boolean;
}

export function UploadZone({
   inputRef,
   onFileSelect,
   buttonText = 'اختيار صور متعددة',
   hintText = 'يمكنك اختيار أكثر من صورة دفعة واحدة، وستظهر المعاينة هنا قبل الحفظ.',
   statsText,
   accept = 'image/jpg,image/jpeg,image/png',
   multiple = true,
}: UploadZoneProps) {
   return (
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
         <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-background px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
         >
            <ImagePlus className="h-4 w-4" />
            {buttonText}
         </button>
         <p className="mt-2 text-sm text-muted-foreground">{hintText}</p>
         {statsText && (
            <p className="mt-1 text-xs text-muted-foreground">{statsText}</p>
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
