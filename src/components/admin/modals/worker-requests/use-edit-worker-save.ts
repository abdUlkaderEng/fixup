'use client';

import { useState } from 'react';
import { workersApi } from '@/api/admin';
import type { ImageUploadState } from '@/components/image-upload';
import type { UpdateWorkerRequest } from '@/types/admin/workers';

interface UseEditWorkerSaveOptions {
   workerId: number;
   onSave: (id: number, data: UpdateWorkerRequest) => Promise<boolean>;
   onSuccess: () => void;
}

export interface UseEditWorkerSaveReturn {
   isUploadingImages: boolean;
   /**
    * Multi-step save:
    *   1. Delete images flagged for removal.
    *   2. Upload newly-added image files.
    *   3. Patch worker fields.
    * Calls `onSuccess` only when all three succeed.
    */
   save: (params: {
      imageState: ImageUploadState;
      fields: UpdateWorkerRequest;
   }) => Promise<void>;
}

export function useEditWorkerSave({
   workerId,
   onSave,
   onSuccess,
}: UseEditWorkerSaveOptions): UseEditWorkerSaveReturn {
   const [isUploadingImages, setIsUploadingImages] = useState(false);

   const save: UseEditWorkerSaveReturn['save'] = async ({
      imageState,
      fields,
   }) => {
      if (imageState.deletedIds.length > 0) {
         await Promise.all(
            imageState.deletedIds.map((id) => workersApi.deleteImage(id))
         );
      }

      if (imageState.newFiles.length > 0) {
         setIsUploadingImages(true);
         try {
            await workersApi.uploadImages(workerId, imageState.newFiles);
         } catch {
            setIsUploadingImages(false);
            return;
         }
         setIsUploadingImages(false);
      }

      const success = await onSave(workerId, fields);
      if (success) onSuccess();
   };

   return { isUploadingImages, save };
}
