'use client';

/**
 * @deprecated This file is kept for backward compatibility.
 * Please import from @/components/ui/app-modal directly.
 */

export {
   AppModal as AdminModal,
   ModalActions,
   ModalPrimaryButton as PrimaryButton,
   ModalSecondaryButton,
} from '@/components/ui/app-modal';

export type { BaseModalProps } from '@/components/ui/app-modal';

/**
 * @deprecated Use ModalSecondaryButton from @/components/ui/app-modal instead
 */
export function CloseButton({ onClose }: { onClose?: () => void }) {
   return (
      <button
         onClick={onClose}
         className="px-4 py-2 border border-border bg-background text-foreground rounded-md hover:bg-accent"
      >
         إغلاق
      </button>
   );
}
