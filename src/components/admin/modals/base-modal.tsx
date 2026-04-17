'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Base modal props interface
 * Provides consistent modal interface across all admin modals
 */
export interface BaseModalProps {
   open: boolean;
   onOpenChange?: (open: boolean) => void;
}

/**
 * Admin modal wrapper component
 * Provides consistent black/white themed modal styling
 */
interface AdminModalProps extends BaseModalProps {
   title: string;
   description?: string;
   children: React.ReactNode;
   className?: string;
}

/**
 * Admin Modal Component
 * Wrapper around shadcn Dialog with admin theme
 */
export function AdminModal({
   open,
   onOpenChange,
   title,
   description,
   children,
   className,
}: AdminModalProps) {
   const router = useRouter();

   const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
         // Close modal by navigating back to dashboard without query params
         router.push('/admin/dashboard');
      }
      onOpenChange?.(isOpen);
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent
            className={cn(
               'max-w-4xl bg-white border-gray-200 text-gray-900 max-h-[95vh] p-0',
               'data-[state=open]:animate-in data-[state=closed]:animate-out',
               'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
               'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
               className
            )}
         >
            <DialogHeader className="border-b border-gray-200 p-6 pb-4">
               <DialogTitle className="text-xl font-semibold text-gray-900 text-center">
                  {title}
               </DialogTitle>
               {description && (
                  <DialogDescription className="text-gray-500 text-center">
                     {description}
                  </DialogDescription>
               )}
            </DialogHeader>
            <div className="overflow-y-auto scrollbar-modern px-6 py-4 max-h-[calc(95vh-120px)]">
               {children}
            </div>
         </DialogContent>
      </Dialog>
   );
}

/**
 * Modal action button bar
 * Consistent footer for modal actions
 */
interface ModalActionsProps {
   children: React.ReactNode;
   className?: string;
}

export function ModalActions({ children, className }: ModalActionsProps) {
   return (
      <div
         className={cn(
            'flex items-center justify-end gap-2 pt-4 border-t border-gray-200',
            className
         )}
      >
         {children}
      </div>
   );
}

/**
 * Modal close button
 * Standard close button for modals
 */
interface CloseButtonProps {
   onClose?: () => void;
}

export function CloseButton({ onClose }: CloseButtonProps) {
   return (
      <Button
         variant="outline"
         onClick={onClose}
         className="border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      >
         إغلاق
      </Button>
   );
}

/**
 * Primary action button for modals
 */
interface PrimaryButtonProps {
   children: React.ReactNode;
   onClick?: () => void;
   disabled?: boolean;
}

export function PrimaryButton({
   children,
   onClick,
   disabled,
}: PrimaryButtonProps) {
   return (
      <Button
         onClick={onClick}
         disabled={disabled}
         className="bg-white text-black hover:bg-white/90"
      >
         {children}
      </Button>
   );
}
