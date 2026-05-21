'use client';

import Link from 'next/link';
import { Wrench } from 'lucide-react';

interface SidebarLogoProps {
   onClick?: () => void;
}

export function SidebarLogo({ onClick }: SidebarLogoProps) {
   return (
      <Link
         href="/worker/dashboard"
         onClick={onClick}
         className="flex flex-1 items-center gap-2.5 overflow-hidden"
      >
         <div className="worker-logo-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
            <Wrench className="h-4 w-4 text-white" />
         </div>
         <div className="min-w-0">
            <span className="block text-base font-bold tracking-tight text-foreground">
               FIXUP
            </span>
            <p className="text-[10px] font-medium leading-tight text-primary">
               منطقة الفني
            </p>
         </div>
      </Link>
   );
}
