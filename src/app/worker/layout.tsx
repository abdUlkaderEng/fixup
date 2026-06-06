'use client';

import { useSession } from 'next-auth/react';
import {
   WorkerSidebar,
   SidebarProvider,
   useSidebar,
} from '@/components/worker/sidebar';
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
               // Mobile: pt for the fixed top bar, pb for the fixed bottom tabs.
               // Desktop (xl): no top bar / bottom tabs, margin tracks sidebar.
               'min-h-screen px-4 pt-16 pb-24 sm:px-6 xl:pt-6 xl:pb-6 transition-[margin] duration-300 ease-in-out',
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
