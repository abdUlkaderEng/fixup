'use client';

import { useImageUploadLogic } from './hooks';
import { ImageGallery } from './components/image-gallery';
import { UploadZone } from './components/upload-zone';
import { IMAGE_UPLOAD_THEMES } from './types';
import type { ImageUploadProps } from './types';

export function ImageUploadField({
   state,
   callbacks,
   config,
   isEditing,
   disabled = false,
   theme = 'default',
}: ImageUploadProps) {
   const tokens = IMAGE_UPLOAD_THEMES[theme];

   const {
      visibleExistingImages,
      hasImages,
      visibleNewFiles,
      handleNewFiles,
      toggleExistingImageDelete,
      removeNewFile,
      inputRef,
   } = useImageUploadLogic({
      existingImages: state.existingImages,
      newFiles: state.newFiles,
      deletedIds: state.deletedIds,
      onStateChange: (changes) => {
         if (changes.newFiles !== undefined) {
            // Full replacement — derive add vs. remove by comparing lengths
            const next = changes.newFiles;
            const prev = state.newFiles;
            if (next.length > prev.length) {
               // Files were added — forward only the newly appended ones
               callbacks.onNewFilesAdd(next.slice(prev.length));
            } else {
               // A file was removed — find which index was removed and notify
               const removedIndex = prev.findIndex(
                  (_, i) => i >= next.length || prev[i] !== next[i]
               );
               if (removedIndex !== -1) {
                  callbacks.onNewFileRemove(removedIndex);
               }
            }
         }
         if (changes.deletedIds !== undefined) {
            const newlyDeleted = changes.deletedIds.filter(
               (id) => !state.deletedIds.includes(id)
            );
            const restored = state.deletedIds.filter(
               (id) => !changes.deletedIds!.includes(id)
            );
            newlyDeleted.forEach((id) => callbacks.onExistingImageDelete(id));
            restored.forEach((id) => callbacks.onExistingImageRestore(id));
         }
      },
   });

   const {
      imageBaseUrl,
      accept = 'image/jpg,image/jpeg,image/png',
      multiple = true,
      emptyStateText = 'لا توجد صور مضافة حتى الآن',
      savedLabel = 'صورة محفوظة',
      pendingDeleteLabel = 'سيتم حذف هذه الصورة عند الحفظ',
      newFileLabel = 'صورة جديدة',
      uploadButtonText = 'اختيار صور متعددة',
      uploadHintText = 'يمكنك اختيار أكثر من صورة دفعة واحدة، وستظهر المعاينة هنا قبل الحفظ.',
   } = config;

   const statsText =
      isEditing && visibleNewFiles.length > 0
         ? `الصور الجديدة: ${visibleNewFiles.length} | الصور الحالية: ${visibleExistingImages.length}`
         : undefined;

   return (
      <div className="space-y-5">
         {!hasImages && (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
               {emptyStateText}
            </div>
         )}

         {hasImages && (
            <ImageGallery
               existingImages={state.existingImages}
               newFiles={isEditing ? visibleNewFiles : []}
               deletedIds={state.deletedIds}
               imageBaseUrl={imageBaseUrl}
               isEditing={isEditing}
               tokens={tokens}
               onExistingImageToggle={toggleExistingImageDelete}
               onNewFileRemove={removeNewFile}
               savedLabel={savedLabel}
               pendingDeleteLabel={pendingDeleteLabel}
               newFileLabel={newFileLabel}
            />
         )}

         {isEditing && !disabled && (
            <UploadZone
               inputRef={inputRef}
               onFileSelect={handleNewFiles}
               tokens={tokens}
               buttonText={uploadButtonText}
               hintText={uploadHintText}
               statsText={statsText}
               accept={accept}
               multiple={multiple}
            />
         )}
      </div>
   );
}
