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
         className="block p-4 bg-zinc-900 border border-white/10 rounded-lg hover:bg-zinc-800 transition-colors group"
      >
         <h3 className="font-semibold text-white group-hover:text-white/90">
            {label}
         </h3>
         <p className="text-sm text-white/50 mt-1">{description}</p>
      </a>
   );
}
