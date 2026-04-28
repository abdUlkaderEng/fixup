'use client';

import { useCallback, useMemo, useRef } from 'react';
import type { ExistingImage } from './types';

function buildFileKey(file: File): string {
   return `${file.name}-${file.size}-${file.lastModified}`;
}

interface UseImageUploadLogicOptions {
   existingImages: ExistingImage[];
   newFiles: File[];
   deletedIds: number[];
   onStateChange: (state: { newFiles?: File[]; deletedIds?: number[] }) => void;
}

interface UseImageUploadLogicReturn {
   visibleExistingImages: ExistingImage[];
   hasImages: boolean;
   visibleNewFiles: File[];
   isMarkedForDelete: (id: number) => boolean;
   handleNewFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
   toggleExistingImageDelete: (id: number) => void;
   removeNewFile: (index: number) => void;
   inputRef: React.RefObject<HTMLInputElement | null>;
}

export function useImageUploadLogic({
   existingImages,
   newFiles,
   deletedIds,
   onStateChange,
}: UseImageUploadLogicOptions): UseImageUploadLogicReturn {
   const inputRef = useRef<HTMLInputElement>(null);

   const visibleExistingImages = useMemo(
      () => existingImages.filter((image) => !deletedIds.includes(image.id)),
      [existingImages, deletedIds]
   );

   const visibleNewFiles = useMemo(() => newFiles, [newFiles]);

   const hasImages = useMemo(
      () => visibleExistingImages.length > 0 || visibleNewFiles.length > 0,
      [visibleExistingImages, visibleNewFiles]
   );

   const isMarkedForDelete = useCallback(
      (id: number) => deletedIds.includes(id),
      [deletedIds]
   );

   const handleNewFiles = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
         const pickedFiles = Array.from(event.target.files ?? []).filter(
            (file) => file.type.startsWith('image/')
         );

         if (pickedFiles.length === 0) {
            event.target.value = '';
            return;
         }

         const seenFiles = new Set(newFiles.map(buildFileKey));
         const mergedFiles = [...newFiles];

         pickedFiles.forEach((file) => {
            const key = buildFileKey(file);
            if (!seenFiles.has(key)) {
               seenFiles.add(key);
               mergedFiles.push(file);
            }
         });

         onStateChange({ newFiles: mergedFiles });
         event.target.value = '';
      },
      [newFiles, onStateChange]
   );

   const toggleExistingImageDelete = useCallback(
      (id: number) => {
         const isDeleted = deletedIds.includes(id);
         const updatedDeletedIds = isDeleted
            ? deletedIds.filter((deletedId) => deletedId !== id)
            : [...deletedIds, id];
         onStateChange({ deletedIds: updatedDeletedIds });
      },
      [deletedIds, onStateChange]
   );

   const removeNewFile = useCallback(
      (index: number) => {
         const updatedFiles = newFiles.filter(
            (_, fileIndex) => fileIndex !== index
         );
         onStateChange({ newFiles: updatedFiles });
      },
      [newFiles, onStateChange]
   );

   return {
      visibleExistingImages,
      hasImages,
      visibleNewFiles,
      isMarkedForDelete,
      handleNewFiles,
      toggleExistingImageDelete,
      removeNewFile,
      inputRef,
   };
}
