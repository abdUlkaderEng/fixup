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

export type AppModalTheme = 'admin' | 'customer' | 'worker';

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
   theme?: AppModalTheme;
}

const sizeClasses = {
   sm: 'max-w-sm',
   md: 'max-w-md',
   lg: 'max-w-2xl',
   xl: 'max-w-4xl',
   full: 'max-w-[95vw]',
};

const modalThemeClasses: Record<
   AppModalTheme,
   {
      content: string;
      header: string;
      title: string;
      description: string;
      footer: string;
      closeButton: string;
      primaryButton: string;
      secondaryButton: string;
   }
> = {
   admin: {
      content: 'admin-modal-content border-gray-200',
      header: 'border-gray-200 bg-gray-50',
      title: 'text-gray-900',
      description: 'text-gray-500',
      footer: 'border-gray-200 bg-gray-50',
      closeButton: 'admin-btn-secondary',
      primaryButton: 'admin-btn-primary',
      secondaryButton: 'admin-btn-secondary',
   },
   customer: {
      content:
         'border-primary/15 bg-background shadow-[0_24px_80px_-28px_rgba(19,55,123,0.32)]',
      header: 'border-primary/12 ',
      title: 'text-primary',
      description: 'text-primary/70',
      footer: 'border-primary/10 bg-background',
      closeButton:
         'border-primary/18 bg-background text-primary hover:bg-primary/5 hover:border-primary/30',
      primaryButton:
         'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      secondaryButton:
         'border-primary/18 bg-background text-primary hover:bg-primary/5 hover:border-primary/30',
   },
   worker: {
      content:
         'border-secondary/20 bg-card text-card-foreground shadow-[0_24px_80px_-28px_rgba(248,198,23,0.28)]',
      header: 'border-secondary/15 bg-muted/70',
      title: 'text-secondary',
      description: 'text-muted-foreground',
      footer: 'border-secondary/15 bg-muted/55',
      closeButton:
         'border-secondary/20 bg-card text-secondary hover:bg-secondary/8 hover:border-secondary/35',
      primaryButton:
         'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
      secondaryButton:
         'border-secondary/20 bg-card text-secondary hover:bg-secondary/8 hover:border-secondary/35',
   },
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
   theme = 'admin',
}: AppModalProps) {
   const router = useRouter();
   const themeClasses = modalThemeClasses[theme];

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
               'flex h-[85vh] flex-col gap-0 border p-0',
               'data-[state=open]:animate-in data-[state=closed]:animate-out',
               'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
               'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
               themeClasses.content,
               sizeClasses[size],
               className
            )}
         >
            <DialogHeader
               className={cn(
                  'shrink-0 border-b p-6 pb-4',
                  themeClasses.header,
                  headerClassName
               )}
            >
               <DialogTitle
                  className={cn(
                     'text-center text-xl font-semibold',
                     themeClasses.title,
                     titleClassName
                  )}
               >
                  {title}
               </DialogTitle>
               {description && (
                  <DialogDescription
                     className={cn(
                        'text-center',
                        themeClasses.description,
                        descriptionClassName
                     )}
                  >
                     {description}
                  </DialogDescription>
               )}
            </DialogHeader>
            <div
               className={cn(
                  'flex-1 min-h-0 overflow-y-auto px-6 py-4',
                  contentClassName
               )}
            >
               {children}
            </div>
            {showCloseButton && (
               <div
                  className={cn(
                     'shrink-0 flex items-center justify-end gap-2 border-t px-6 pb-6 ',
                     themeClasses.footer
                  )}
               >
                  <Button
                     variant="outline"
                     onClick={handleClose}
                     className={themeClasses.closeButton}
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
   theme?: AppModalTheme;
}

export function ModalPrimaryButton({
   children,
   onClick,
   disabled,
   className,
   theme = 'admin',
}: ModalPrimaryButtonProps) {
   return (
      <Button
         onClick={onClick}
         disabled={disabled}
         className={cn(modalThemeClasses[theme].primaryButton, className)}
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
   theme?: AppModalTheme;
}

export function ModalSecondaryButton({
   children,
   onClick,
   disabled,
   className,
   theme = 'admin',
}: ModalSecondaryButtonProps) {
   return (
      <Button
         variant="outline"
         onClick={onClick}
         disabled={disabled}
         className={cn(modalThemeClasses[theme].secondaryButton, className)}
      >
         {children}
      </Button>
   );
}
