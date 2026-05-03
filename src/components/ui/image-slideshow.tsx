'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import Image from 'next/image';

// ============================================
// Types
// ============================================

export interface ImageSlideshowImage {
   id: number;
   url: string;
   alt?: string;
}

export interface ImageSlideshowProps {
   images: ImageSlideshowImage[];
   className?: string;
   showThumbnails?: boolean;
   aspectRatio?: 'square' | 'video' | 'portrait';
   enableLightbox?: boolean;
   emptyState?: React.ReactNode;
}

// ============================================
// Helper Components
// ============================================

function ImagePlaceholder() {
   return (
      <div className="flex items-center justify-center w-full h-full bg-muted">
         <span className="text-muted-foreground text-sm">لا توجد صور</span>
      </div>
   );
}

// ============================================
// Main Component
// ============================================

export function ImageSlideshow({
   images,
   className,
   showThumbnails = true,
   aspectRatio = 'video',
   enableLightbox = true,
   emptyState,
}: ImageSlideshowProps) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [isLightboxOpen, setIsLightboxOpen] = useState(false);

   const hasImages = images.length > 0;
   const currentImage = hasImages ? images[currentIndex] : null;

   const goToNext = useCallback(
      (e?: React.MouseEvent) => {
         e?.stopPropagation();
         setCurrentIndex((prev) => (prev + 1) % images.length);
      },
      [images.length]
   );

   const goToPrev = useCallback(
      (e?: React.MouseEvent) => {
         e?.stopPropagation();
         setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      },
      [images.length]
   );

   const goToIndex = useCallback((index: number) => {
      setCurrentIndex(index);
   }, []);

   const openLightbox = useCallback(() => {
      if (enableLightbox && hasImages) {
         setIsLightboxOpen(true);
      }
   }, [enableLightbox, hasImages]);

   const closeLightbox = useCallback(() => {
      setIsLightboxOpen(false);
   }, []);

   // Aspect ratio classes
   const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
   };

   if (!hasImages) {
      return (
         <div
            className={cn(
               'overflow-hidden rounded-lg',
               aspectClasses[aspectRatio],
               className
            )}
         >
            {emptyState ?? <ImagePlaceholder />}
         </div>
      );
   }

   return (
      <>
         <div className={cn('space-y-3', className)}>
            {/* Main Image Display */}
            <div
               className={cn(
                  'relative overflow-hidden rounded-lg bg-muted group',
                  aspectClasses[aspectRatio],
                  enableLightbox && 'cursor-pointer'
               )}
               onClick={openLightbox}
            >
               {/* Current Image */}

               <img
                  src={currentImage?.url}
                  alt={currentImage?.alt ?? `صورة ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
               />

               {/* Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

               {/* Zoom Icon */}
               {enableLightbox && (
                  <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                     <ZoomIn className="h-4 w-4" />
                  </div>
               )}

               {/* Navigation Arrows */}
               {images.length > 1 && (
                  <>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={goToPrev}
                     >
                        <ChevronRight className="h-5 w-5" />
                     </Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={goToNext}
                     >
                        <ChevronLeft className="h-5 w-5" />
                     </Button>
                  </>
               )}

               {/* Image Counter */}
               <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white text-sm font-medium">
                  {currentIndex + 1} / {images.length}
               </div>
            </div>

            {/* Thumbnails */}
            {showThumbnails && images.length > 1 && (
               <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((image, index) => (
                     <button
                        key={image.id}
                        onClick={() => goToIndex(index)}
                        className={cn(
                           'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all',
                           'hover:ring-2 hover:ring-primary/50',
                           index === currentIndex
                              ? 'ring-2 ring-primary ring-offset-2'
                              : 'opacity-60 hover:opacity-100'
                        )}
                     >
                        <img
                           src={image.url}
                           alt={image.alt ?? `صورة مصغرة ${index + 1}`}
                           className="w-full h-full object-cover"
                        />
                     </button>
                  ))}
               </div>
            )}
         </div>

         {/* Lightbox */}
         {enableLightbox && (
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
               <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none">
                  <DialogTitle className="sr-only">
                     عرض الصورة {currentIndex + 1} من {images.length}
                  </DialogTitle>
                  <div className="relative flex items-center justify-center min-h-[60vh]">
                     {/* Close Button */}
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 left-4 z-50 text-white hover:bg-white/20"
                        onClick={closeLightbox}
                     >
                        <X className="h-6 w-6" />
                     </Button>

                     {/* Navigation */}
                     {images.length > 1 && (
                        <>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20"
                              onClick={goToPrev}
                           >
                              <ChevronRight className="h-8 w-8" />
                           </Button>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white hover:bg-white/20"
                              onClick={goToNext}
                           >
                              <ChevronLeft className="h-8 w-8" />
                           </Button>
                        </>
                     )}

                     {/* Lightbox Image */}
                     <img
                        src={currentImage?.url}
                        alt={currentImage?.alt ?? `صورة ${currentIndex + 1}`}
                        className="max-w-full max-h-[80vh] object-contain"
                     />

                     {/* Counter */}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full text-white">
                        {currentIndex + 1} / {images.length}
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         )}
      </>
   );
}

export default ImageSlideshow;
