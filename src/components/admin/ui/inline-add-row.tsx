'use client';

import React, { useState, useCallback } from 'react';
import { Loader2, Check, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// ============================================
// Types
// ============================================
export interface InlineAddRowProps {
   /** Label for the trigger button */
   triggerLabel: string;
   /** Placeholder text for input */
   placeholder?: string;
   /** Icon to display (defaults to Plus) */
   icon?: React.ReactNode;
   /** Save handler - receives trimmed value, returns promise for async handling */
   onSave: (value: string) => Promise<void> | void;
   /** Whether save is in progress (controlled from parent for async operations) */
   isSaving?: boolean;
   /** Whether the component is disabled */
   disabled?: boolean;
   /** Custom save button content */
   saveButtonContent?: React.ReactNode;
   /** Custom cancel button text */
   cancelText?: string;
   /** Additional CSS classes */
   className?: string;
}

// ============================================
// Component
// ============================================

/**
 * Inline add row with integrated trigger button and input field.
 * Shows an "Add" button initially, then expands to show input with save/cancel.
 * Used across admin modals for consistent add-item UI.
 *
 * @example
 * <InlineAddRow
 *    triggerLabel="إضافة مهنة جديدة"
 *    placeholder="اسم المهنة الجديدة..."
 *    icon={<Briefcase className="h-5 w-5" />}
 *    onSave={async (name) => await createCareer({ name })}
 * />
 */
export function InlineAddRow({
   triggerLabel,
   placeholder = 'إضافة جديدة...',
   icon,
   onSave,
   isSaving = false,
   disabled = false,
   saveButtonContent,
   cancelText = 'إلغاء',
   className,
}: InlineAddRowProps) {
   const [isAdding, setIsAdding] = useState(false);
   const [value, setValue] = useState('');

   const handleStartAdding = useCallback(() => {
      setIsAdding(true);
   }, []);

   const handleCancel = useCallback(() => {
      setIsAdding(false);
      setValue('');
   }, []);

   const handleSave = useCallback(
      async (e?: React.MouseEvent) => {
         e?.preventDefault();
         e?.stopPropagation();

         const trimmed = value.trim();
         if (!trimmed || isSaving) return;

         try {
            const result = onSave(trimmed);
            // If onSave returns a promise, wait for it
            if (result instanceof Promise) {
               await result;
            }
            // Reset state after successful save - batch updates
            setValue('');
            setIsAdding(false);
         } catch {
            // Error handled by parent, keep input open for retry
         }
      },
      [value, onSave, isSaving]
   );

   const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
         if (e.key === 'Enter') {
            handleSave();
         } else if (e.key === 'Escape') {
            handleCancel();
         }
      },
      [handleSave, handleCancel]
   );

   // Render trigger button when not in adding mode
   if (!isAdding) {
      return (
         <button
            onClick={handleStartAdding}
            disabled={disabled}
            className={[
               'w-full flex items-center justify-center gap-2 p-4',
               'admin-panel-subtle border-dashed',
               'hover:bg-gray-100 transition-colors',
               'disabled:opacity-50 disabled:cursor-not-allowed',
               className,
            ].join(' ')}
         >
            <Plus className="h-5 w-5" />
            <span className="font-medium">{triggerLabel}</span>
         </button>
      );
   }

   // Render input row when in adding mode
   return (
      <div
         className={[
            'flex items-center gap-2 p-4',
            'admin-panel-subtle',
            className,
         ].join(' ')}
      >
         <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {icon ?? <Plus className="h-5 w-5 text-gray-500" />}
         </div>
         <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 admin-input h-10"
            autoFocus
            disabled={isSaving}
         />
         <Button
            size="sm"
            className="h-10 admin-btn-primary px-3"
            onClick={(e) => handleSave(e)}
            disabled={!value.trim() || isSaving}
         >
            {isSaving ? (
               <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
               (saveButtonContent ?? <Check className="h-4 w-4" />)
            )}
         </Button>
         <Button
            size="sm"
            variant="outline"
            className="h-10 admin-btn-secondary px-3"
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               handleCancel();
            }}
            disabled={isSaving}
         >
            {cancelText}
         </Button>
      </div>
   );
}
