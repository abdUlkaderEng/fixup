'use client';

import type { ExistingImage } from '../types';
import { ExistingImageCard } from './ExistingImageCard';
import { NewImagePreview } from './NewImagePreview';

interface ImageGalleryProps {
   existingImages: ExistingImage[];
   newFiles: File[];
   deletedIds: number[];
   imageBaseUrl: string;
   isEditing: boolean;
   onExistingImageToggle: (id: number) => void;
   onNewFileRemove: (index: number) => void;
   savedLabel?: string;
   pendingDeleteLabel?: string;
   newFileLabel?: string;
}

export function ImageGallery({
   existingImages,
   newFiles,
   deletedIds,
   imageBaseUrl,
   isEditing,
   onExistingImageToggle,
   onNewFileRemove,
   savedLabel,
   pendingDeleteLabel,
   newFileLabel,
}: ImageGalleryProps) {
   const isMarkedForDelete = (id: number) => deletedIds.includes(id);

   return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
         {existingImages.map((image) => (
            <ExistingImageCard
               key={image.id}
               image={image}
               isMarkedForDelete={isMarkedForDelete(image.id)}
               imageBaseUrl={imageBaseUrl}
               savedLabel={savedLabel}
               pendingDeleteLabel={pendingDeleteLabel}
               onToggleDelete={() => onExistingImageToggle(image.id)}
               isEditing={isEditing}
            />
         ))}

         {isEditing &&
            newFiles.map((file, index) => (
               <NewImagePreview
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  file={file}
                  onRemove={() => onNewFileRemove(index)}
                  label={newFileLabel}
               />
            ))}
      </div>
   );
}
