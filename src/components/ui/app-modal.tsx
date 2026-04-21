'use client';

import { ReactNode } from 'react';
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

export interface BaseModalProps {
   open: boolean;
   onOpenChange?: (open: boolean) => void;
}

interface AppModalProps extends BaseModalProps {
   title: string;
   description?: string;
   children: ReactNode;
   className?: string;
   contentClassName?: string;
   headerClassName?: string;
   titleClassName?: string;
   descriptionClassName?: string;
   size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
   closeHref?: string;
   showCloseButton?: boolean;
   closeButtonText?: string;
   onClose?: () => void;
}

const sizeClasses = {
   sm: 'max-w-sm',
   md: 'max-w-md',
   lg: 'max-w-2xl',
   xl: 'max-w-4xl',
   full: 'max-w-[95vw]',
};

export function AppModal({
   open,
   onOpenChange,
   title,
   description,
   children,
   className,
   contentClassName,
   headerClassName,
   titleClassName,
   descriptionClassName,
   size = 'xl',
   closeHref,
   showCloseButton = true,
   closeButtonText = 'Close',
   onClose,
}: AppModalProps) {
   const router = useRouter();

   const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
         if (closeHref) {
            router.push(closeHref);
         }
         onClose?.();
      }
      onOpenChange?.(isOpen);
   };

   const handleClose = () => {
      if (closeHref) {
         router.push(closeHref);
      }
      onClose?.();
      onOpenChange?.(false);
   };

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent
            className={cn(
               'admin-modal-content max-h-[95vh] p-0 gap-0',
               'border border-gray-200',
               'data-[state=open]:animate-in data-[state=closed]:animate-out',
               'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
               'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
               sizeClasses[size],
               className
            )}
         >
            <DialogHeader
               className={cn(
                  'border-b border-gray-200 p-6 pb-4 bg-gray-50',
                  headerClassName
               )}
            >
               <DialogTitle
                  className={cn(
                     'text-xl font-semibold text-gray-900 text-center',
                     titleClassName
                  )}
               >
                  {title}
               </DialogTitle>
               {description && (
                  <DialogDescription
                     className={cn(
                        'text-gray-500 text-center',
                        descriptionClassName
                     )}
                  >
                     {description}
                  </DialogDescription>
               )}
            </DialogHeader>
            <div
               className={cn(
                  'overflow-y-auto px-6 py-4 max-h-[calc(95vh-120px)]',
                  contentClassName
               )}
            >
               {children}
            </div>
            {showCloseButton && (
               <div className="flex items-center justify-end gap-2 pt-4 px-6 pb-6 border-t border-gray-200 bg-gray-50">
                  <Button
                     variant="outline"
                     onClick={handleClose}
                     className="admin-btn-secondary"
                  >
                     {closeButtonText}
                  </Button>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}

interface ModalActionsProps {
   children: ReactNode;
   className?: string;
   align?: 'start' | 'center' | 'end';
}

export function ModalActions({
   children,
   className,
   align = 'end',
}: ModalActionsProps) {
   const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
   };

   return (
      <div
         className={cn(
            'flex items-center gap-2 pt-4 border-t border-border',
            alignClasses[align],
            className
         )}
      >
         {children}
      </div>
   );
}

interface ModalPrimaryButtonProps {
   children: ReactNode;
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export function ModalPrimaryButton({
   children,
   onClick,
   disabled,
   className,
}: ModalPrimaryButtonProps) {
   return (
      <Button
         onClick={onClick}
         disabled={disabled}
         className={cn('admin-btn-primary', className)}
      >
         {children}
      </Button>
   );
}

interface ModalSecondaryButtonProps {
   children: ReactNode;
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

export function ModalSecondaryButton({
   children,
   onClick,
   disabled,
   className,
}: ModalSecondaryButtonProps) {
   return (
      <Button
         variant="outline"
         onClick={onClick}
         disabled={disabled}
         className={cn('admin-btn-secondary', className)}
      >
         {children}
      </Button>
   );
}
