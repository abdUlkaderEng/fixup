'use client';

import type { QuickActionProps } from '@/types/admin';

/**
 * Quick action card component
 * Link card that opens a specific modal
 */
export function QuickActionCard({
   label,
   modal,
   description,
}: QuickActionProps) {
   const href = `/admin/dashboard?modal=${modal}`;

   return (
      <a
         href={href}
         className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group shadow-sm"
      >
         <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
            {label}
         </h3>
         <p className="text-sm text-gray-500 mt-1">{description}</p>
      </a>
   );
}
