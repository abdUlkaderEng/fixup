'use client';

import { useImageUploadLogic } from './hooks';
import { ImageGallery } from './components/ImageGallery';
import { UploadZone } from './components/UploadZone';
import type { ImageUploadProps } from './types';

export function ImageUploadField({
   state,
   callbacks,
   config,
   isEditing,
   disabled = false,
}: ImageUploadProps) {
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
            const addedFiles = changes.newFiles.slice(state.newFiles.length);
            if (addedFiles.length > 0) {
               callbacks.onNewFilesAdd(addedFiles);
            } else {
               callbacks.onNewFilesAdd([]);
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
