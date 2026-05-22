'use client';

import React from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListItemRow } from './list-item-row';

// ============================================
// Types
// ============================================

export interface EditableListItemRowProps {
   /** Item ID */
   id: string | number;
   /** Display value (shown in view mode) */
   value: string;
   /** Icon for the row */
   icon?: React.ReactNode;
   /** Whether this row is in edit mode (parent-controlled) */
   isEditing: boolean;
   /** Current value in the edit input (parent-controlled) */
   editValue: string;
   /** Switch this row into edit mode */
   onEditStart: () => void;
   /** Update the edit-input value */
   onEditChange: (next: string) => void;
   /** Commit the edit */
   onEditSave: () => void;
   /** Discard the edit */
   onEditCancel: () => void;
   /** Delete handler (omit to hide the delete action) */
   onDelete?: () => void;
   /** Whether the save mutation is in flight */
   isUpdating?: boolean;
   /** Whether the delete mutation is in flight */
   isDeleting?: boolean;
   /** Placeholder for the edit input */
   editPlaceholder?: string;
   /** Additional CSS classes */
   className?: string;
}

// ============================================
// Component
// ============================================

/**
 * List row with inline edit + delete actions.
 *
 * Edit state is parent-controlled so the parent can enforce "edit one at a
 * time" by tracking a single `editingId`. Renders `ListItemRow` in view mode
 * and an inline input shell in edit mode.
 */
export function EditableListItemRow({
   id,
   value,
   icon,
   isEditing,
   editValue,
   onEditStart,
   onEditChange,
   onEditSave,
   onEditCancel,
   onDelete,
   isUpdating,
   isDeleting,
   editPlaceholder,
   className,
}: EditableListItemRowProps) {
   if (isEditing) {
      return (
         <div
            className={[
               'flex items-center gap-2 p-4 admin-panel-subtle',
               className,
            ].join(' ')}
         >
            {icon && (
               <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {icon}
               </div>
            )}
            <Input
               value={editValue}
               onChange={(e) => onEditChange(e.target.value)}
               placeholder={editPlaceholder}
               className="flex-1 admin-input h-10"
               autoFocus
               disabled={isUpdating}
               onKeyDown={(e) => {
                  if (e.key === 'Enter') onEditSave();
                  if (e.key === 'Escape') onEditCancel();
               }}
            />
            <Button
               size="sm"
               onClick={onEditSave}
               disabled={!editValue.trim() || isUpdating}
               className="admin-btn-primary h-10"
            >
               {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                  'حفظ'
               )}
            </Button>
            <Button
               size="sm"
               variant="outline"
               onClick={onEditCancel}
               disabled={isUpdating}
               className="admin-btn-secondary h-10"
            >
               إلغاء
            </Button>
         </div>
      );
   }

   return (
      <ListItemRow
         id={id}
         title={value}
         icon={icon}
         className={className}
         actions={
            <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 admin-btn-ghost"
               onClick={onEditStart}
               disabled={isUpdating || isDeleting}
            >
               <Edit2 className="h-4 w-4" />
            </Button>
         }
         onDelete={onDelete ? () => onDelete() : undefined}
         isDeleting={isDeleting}
      />
   );
}
