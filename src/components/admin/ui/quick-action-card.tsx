'use client';

import type { QuickActionProps } from '@/types/admin';

/**
 * Quick action card component
 * Link card that opens a specific modal — styled to match the dashboard stat cards.
 */
export function QuickActionCard({
   label,
   modal,
   description,
   icon: Icon,
}: QuickActionProps) {
   const href = `/admin/dashboard?modal=${modal}`;

   return (
      <a
         href={href}
         className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#13377b]/20 hover:shadow-md"
      >
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
               <h3 className="font-semibold admin-text transition-colors group-hover:text-[#13377b]">
                  {label}
               </h3>
               <p className="mt-1 text-sm admin-text-muted">{description}</p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#13377b]/10 text-[#13377b] transition-colors duration-200 group-hover:bg-[#13377b]/15">
               <Icon className="h-5 w-5" />
            </div>
         </div>
      </a>
   );
}
