/**
 * Image Upload Component - Type Definitions
 */

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
}
