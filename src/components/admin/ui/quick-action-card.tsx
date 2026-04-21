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
         className="block p-4 admin-panel hover:border-[#13377b]/30 hover:bg-[#13377b]/5 transition-colors group"
      >
         <h3 className="font-semibold admin-text group-hover:text-[#13377b] transition-colors">
            {label}
         </h3>
         <p className="text-sm admin-text-muted mt-1">{description}</p>
      </a>
   );
}
