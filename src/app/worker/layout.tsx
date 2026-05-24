'use client';

import { useSession } from 'next-auth/react';
import { WorkerSidebar } from '@/components/worker/sidebar';
import {
   SidebarProvider,
   useSidebar,
} from '@/components/worker/sidebar-context';
import { useAuthToken } from '@/hooks/auth';
import { cn } from '@/lib/utils';

function WorkerLayoutInner({ children }: { children: React.ReactNode }) {
   useAuthToken();
   const { data: session } = useSession();
   const { open } = useSidebar();
   const workerName = session?.user?.name || 'الفني';

   return (
      <div className="worker-theme min-h-screen bg-background">
         <WorkerSidebar workerName={workerName} />
         {/*
            Desktop: mr tracks sidebar width — 18rem (expanded) or 4rem (collapsed).
            Mobile:  no margin; pt-16 reserves space for the fixed hamburger button.
         */}
         {/* Mobile: sidebar is an overlay — no margin.                    */}
         {/* Desktop: margin tracks sidebar width via Tailwind class swap.  */}
         <main
            className={cn(
               'min-h-screen p-4 pt-18 sm:p-6 xl:pt-6 transition-[margin] duration-300 ease-in-out',
               open ? 'xl:mr-72' : 'xl:mr-16'
            )}
         >
            {children}
         </main>
      </div>
   );
}

export default function WorkerLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <SidebarProvider>
         <WorkerLayoutInner>{children}</WorkerLayoutInner>
      </SidebarProvider>
   );
}
