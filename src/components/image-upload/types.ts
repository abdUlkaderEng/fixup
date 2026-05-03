/**
 * Image Upload Component - Type Definitions
 */

// ─── Theme ────────────────────────────────────────────────────────────────────

export type ImageUploadTheme = 'default' | 'admin' | 'customer' | 'worker';

export interface ImageUploadThemeTokens {
   /** Dashed upload zone wrapper */
   zoneWrapper: string;
   /** Upload button inside the zone */
   zoneButton: string;
   /** Hint / stats text inside the zone */
   zoneHint: string;
   /** Card border + bg (existing & new) */
   cardBorder: string;
}

export const IMAGE_UPLOAD_THEMES: Record<
   ImageUploadTheme,
   ImageUploadThemeTokens
> = {
   default: {
      zoneWrapper: 'border-primary/40 bg-primary/5',
      zoneButton:
         'border-primary/30 bg-background text-primary hover:bg-primary/5',
      zoneHint: 'text-muted-foreground',
      cardBorder: 'border-border/70 bg-muted',
   },
   admin: {
      zoneWrapper: 'border-gray-300 bg-gray-50',
      zoneButton:
         'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400',
      zoneHint: 'text-gray-400',
      cardBorder: 'border-gray-200 bg-gray-50',
   },
   customer: {
      zoneWrapper: 'border-primary/40 bg-primary/5',
      zoneButton: 'border-primary/30 bg-white text-primary hover:bg-primary/8',
      zoneHint: 'text-primary/60',
      cardBorder: 'border-primary/20 bg-primary/5',
   },
   worker: {
      zoneWrapper: 'border-secondary/50 bg-secondary/10',
      zoneButton:
         'border-secondary/40 bg-white text-[#6e5700] hover:bg-secondary/15',
      zoneHint: 'text-[#8a6e00]/70',
      cardBorder: 'border-secondary/30 bg-secondary/5',
   },
};

// ─── Core types ───────────────────────────────────────────────────────────────

export interface ExistingImage {
   id: number;
   path: string;
}

export interface ImageUploadState {
   existingImages: ExistingImage[];
   newFiles: File[];
   deletedIds: number[];
}

export interface ImageUploadCallbacks {
   onNewFilesAdd: (files: File[]) => void;
   onNewFileRemove: (index: number) => void;
   onExistingImageDelete: (id: number) => void;
   onExistingImageRestore: (id: number) => void;
}

export interface ImageUploadConfig {
   imageBaseUrl: string;
   accept?: string;
   multiple?: boolean;
   maxFileSize?: number;
   title?: string;
   emptyStateText?: string;
   newFileLabel?: string;
   existingImageLabel?: string;
   savedLabel?: string;
   pendingDeleteLabel?: string;
   uploadButtonText?: string;
   uploadHintText?: string;
   maxFileSizeError?: string;
   invalidTypeError?: string;
}

export interface ImageUploadProps {
   state: ImageUploadState;
   callbacks: ImageUploadCallbacks;
   config: ImageUploadConfig;
   isEditing: boolean;
   disabled?: boolean;
   theme?: ImageUploadTheme;
}
