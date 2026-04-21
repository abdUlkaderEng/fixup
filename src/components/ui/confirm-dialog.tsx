'use client';

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';

type ConfirmDialogVariant = 'destructive' | 'default' | 'warning';

interface ConfirmDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   isLoading?: boolean;
   title?: string;
   description?: React.ReactNode;
   confirmLabel?: string;
   cancelLabel?: string;
   confirmIcon?: React.ReactNode;
   variant?: ConfirmDialogVariant;
   isAdmin?: boolean;
}

const iconColor: Record<ConfirmDialogVariant, string> = {
   destructive: 'text-destructive',
   warning: 'text-yellow-500',
   default: 'text-primary',
};

export function ConfirmDialog({
   open,
   onOpenChange,
   onConfirm,
   isLoading = false,
   title = 'تأكيد',
   description,
   confirmLabel = 'تأكيد',
   cancelLabel = 'إلغاء',
   confirmIcon,
   variant = 'default',
   isAdmin = false,
}: ConfirmDialogProps) {
   const confirmBtnVariant =
      variant === 'default'
         ? 'default'
         : variant === 'warning'
           ? 'outline'
           : 'destructive';

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className={cn(
               'max-w-md',
               isAdmin && 'admin-modal-content p-0 gap-0 border border-gray-200'
            )}
         >
            <DialogHeader
               className={cn(
                  isAdmin && 'border-b border-gray-200 px-6 py-4 bg-gray-50'
               )}
            >
               <DialogTitle
                  className={cn(
                     'flex items-center gap-2',
                     isAdmin && 'text-base font-semibold text-gray-900'
                  )}
               >
                  <AlertCircle className={cn('h-5 w-5', iconColor[variant])} />
                  {title}
               </DialogTitle>
               {description && (
                  <DialogDescription
                     className={cn(isAdmin && 'text-sm text-gray-500 mt-1')}
                  >
                     {description}
                  </DialogDescription>
               )}
            </DialogHeader>
            <div
               className={cn(
                  'flex justify-end gap-2',
                  isAdmin
                     ? 'px-6 py-4 border-t border-gray-200 bg-gray-50'
                     : 'pt-4'
               )}
            >
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className={cn(isAdmin && 'admin-btn-secondary')}
               >
                  {cancelLabel}
               </Button>
               <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  variant={isAdmin ? undefined : confirmBtnVariant}
                  className={cn(
                     isAdmin &&
                        variant === 'destructive' &&
                        'bg-destructive text-white hover:bg-destructive/90',
                     isAdmin &&
                        variant === 'warning' &&
                        'bg-[#f8c617] text-gray-900 hover:bg-[#f8c617]/80',
                     isAdmin && variant === 'default' && 'admin-btn-primary'
                  )}
               >
                  {isLoading ? (
                     <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                     confirmIcon && <span className="mr-1">{confirmIcon}</span>
                  )}
                  {confirmLabel}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}

export { ConfirmDialog as DeleteConfirmDialog };
export type { ConfirmDialogProps };
