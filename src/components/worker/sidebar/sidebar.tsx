'use client';

import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarHeader } from './sidebar-header';
import { SidebarLogo } from './sidebar-logo';
import { CareerFeeBadge } from './career-fee-badge';
import { SidebarIdentityCard } from './sidebar-identity-card';
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';
import { WorkerMobileNav } from './worker-mobile-nav';
import { NotificationFlyout } from './notification-flyout';
import { MobileNotificationFAB } from './mobile-notification-fab';
import { useWorkerSidebarState } from './use-worker-sidebar-state';
import { useWorkerWalletCheckSync } from '@/stores/worker-wallet-check';

export function WorkerSidebar({ workerName }: { workerName: string }) {
   const {
      open,
      toggle,
      close,
      notifOpen,
      openNotif,
      closeNotif,
      navLinks,
      notifications: {
         notifications,
         unreadCount,
         isLoading,
         refetch,
         markRead,
      },
   } = useWorkerSidebarState();

   // Keep global worker wallet/fee values in sync for components that rely on them.
   useWorkerWalletCheckSync();

   return (
      <>
         {/* Desktop sidebar */}
         <aside
            className={cn(
               'worker-sidebar fixed right-0 top-0 z-40 hidden h-screen flex-col border-l border-border/60 shadow-sm transition-[width] duration-300 ease-in-out xl:flex',
               open ? 'w-72' : 'w-16'
            )}
         >
            <SidebarHeader expanded={open} onToggle={toggle} />
            {open && <SidebarIdentityCard workerName={workerName} />}
            <SidebarNav navLinks={navLinks} collapsed={!open} />
            <SidebarFooter
               collapsed={!open}
               unreadCount={unreadCount}
               onNotificationOpen={openNotif}
            />
         </aside>
         {/* Mobile top bar — branding + career fee + theme (nav lives in the bottom tabs) */}
         <header className="worker-sidebar fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-border/60 px-4 xl:hidden">
            <SidebarLogo />
            <div className="flex shrink-0 items-center gap-2">
               <CareerFeeBadge className="mt-0" />
               <ThemeToggle />
            </div>
         </header>

         {/* Mobile bottom navigation tabs */}
         <WorkerMobileNav navLinks={navLinks} />

         {/* Global overlays */}
         <MobileNotificationFAB unreadCount={unreadCount} onClick={openNotif} />
         <NotificationFlyout
            open={notifOpen}
            onClose={closeNotif}
            onNavigate={close}
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={isLoading}
            refetch={refetch}
            markRead={markRead}
         />
      </>
   );
}
