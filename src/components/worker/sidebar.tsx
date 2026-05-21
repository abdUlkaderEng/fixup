'use client';

import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
   SidebarHeader,
   SidebarIdentityCard,
   SidebarNav,
   SidebarFooter,
   NotificationFlyout,
   MobileNotificationFAB,
   useWorkerSidebarState,
} from './sidebar/index';

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

         {/* Mobile top bar */}
         <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-end px-4 xl:hidden">
            <button
               type="button"
               onClick={toggle}
               aria-label="فتح القائمة"
               className="worker-mobile-toggle flex h-8 w-8 items-center justify-center rounded-xl"
            >
               <Menu className="h-4 w-4 text-white" />
            </button>
         </div>

         {/* Mobile drawer */}
         {open && (
            <>
               <div
                  className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm xl:hidden"
                  onClick={close}
               />
               <aside className="worker-sidebar fixed right-0 top-0 z-70 flex h-screen w-72 flex-col border-l border-border/60 shadow-xl xl:hidden">
                  <SidebarHeader
                     expanded={true}
                     onToggle={close}
                     showCloseButton
                  />
                  <SidebarIdentityCard workerName={workerName} />
                  <SidebarNav
                     navLinks={navLinks}
                     collapsed={false}
                     onNavClick={close}
                  />
                  <SidebarFooter
                     collapsed={false}
                     unreadCount={unreadCount}
                     onNotificationOpen={openNotif}
                  />
               </aside>
            </>
         )}

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
