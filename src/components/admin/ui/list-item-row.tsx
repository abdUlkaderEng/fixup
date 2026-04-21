'use client';

import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============================================
// Types
// ============================================
export interface ListItemRowProps {
   /** Item ID */
   id: string | number;
   /** Primary text/title */
   title: string;
   /** Secondary text (e.g., date, description) */
   subtitle?: string;
   /** Icon to display */
   icon?: React.ReactNode;
   /** Delete handler */
   onDelete?: (id: string | number) => void;
   /** Whether item is being deleted */
   isDeleting?: boolean;
   /** Custom action buttons */
   actions?: React.ReactNode;
   /** Additional CSS classes */
   className?: string;
}

// ============================================
// Component
// ============================================

/**
 * Generic list item row with icon, title, subtitle, and optional delete action.
 * Used across admin modals for consistent item display.
 *
 * @example
 * <ListItemRow
 *    id={item.id}
 *    title={item.name}
 *    subtitle={item.date}
 *    icon={<Briefcase className="h-5 w-5" />}
 *    onDelete={handleDelete}
 * />
 */
export function ListItemRow({
   id,
   title,
   subtitle,
   icon,
   onDelete,
   isDeleting,
   actions,
   className,
}: ListItemRowProps) {
   return (
      <div
         className={[
            'group flex items-center justify-between gap-3',
            'p-4 admin-panel hover:border-gray-300 transition-colors',
            className,
         ].join(' ')}
      >
         <div className="flex items-center gap-3 min-w-0">
            {icon && (
               <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {icon}
               </div>
            )}
            <div className="min-w-0">
               <p className="font-medium admin-text truncate">{title}</p>
               {subtitle && (
                  <p className="text-sm admin-text-muted">{subtitle}</p>
               )}
            </div>
         </div>

         <div className="flex items-center gap-1">
            {actions}
            {onDelete && (
               <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-9 w-9 admin-btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDelete(id)}
                  disabled={isDeleting}
               >
                  {isDeleting ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Trash2 className="h-4 w-4" />
                  )}
               </Button>
            )}
         </div>
      </div>
   );
}
