'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
   LayoutDashboard,
   User,
   LogOut,
   Menu,
   X,
   ChevronLeft,
   Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { NotificationPanel } from '@/components/notifications';
import { useWorkerNotifications } from '@/hooks/worker';
import { useSidebar } from './sidebar-context';

function WorkerNotificationPanel({ onNavigate }: { onNavigate: () => void }) {
   const { notifications, unreadCount, isLoading, refetch, markRead } =
      useWorkerNotifications();

   return (
      <div className="mt-3 px-0">
         <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            الإشعارات
         </p>
         <NotificationPanel
            notifications={notifications}
            unreadCount={unreadCount}
            isLoading={isLoading}
            theme="worker"
            onNavigate={onNavigate}
            onRefresh={refetch}
            onMarkRead={markRead}
         />
      </div>
   );
}

const NAV_LINKS = [
   { href: '/worker/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
   { href: '/worker/profile', label: 'الملف الشخصي', icon: User },
] as const;

interface WorkerSidebarProps {
   workerName: string;
}

function SidebarInner({
   workerName,
   onClose,
   showCloseBtn,
}: {
   workerName: string;
   onClose: () => void;
   showCloseBtn: boolean;
}) {
   const pathname = usePathname();
   const initial = workerName.charAt(0).toUpperCase();

   return (
      <div className="flex h-full flex-col">
         <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5">
            <Link
               href="/worker/dashboard"
               className="flex items-center gap-2.5"
               onClick={onClose}
            >
               <div className="worker-logo-icon flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
                  <Wrench className="h-4 w-4 text-white" />
               </div>
               <div>
                  <span className="text-base font-bold tracking-tight text-foreground">
                     FIXUP
                  </span>
                  <p className="text-[10px] font-medium leading-tight text-primary">
                     منطقة الفني
                  </p>
               </div>
            </Link>
            {showCloseBtn ? (
               <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="إغلاق القائمة"
               >
                  <X className="h-5 w-5" />
               </button>
            ) : null}
         </div>

         <div className="border-b border-border/40 px-4 py-4">
            <div className="worker-identity-card flex items-center gap-3 rounded-xl px-2 py-2.5">
               <div className="worker-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm">
                  {initial}
               </div>
               <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                     {workerName}
                  </p>
                  <p className="text-[11px] font-medium text-primary">
                     فني معتمد
                  </p>
               </div>
            </div>
         </div>

         <nav className="scrollbar-hover flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
               القائمة الرئيسية
            </p>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
               const isActive =
                  pathname === href || pathname?.startsWith(href + '/');

               return (
                  <Link
                     key={href}
                     href={href}
                     onClick={onClose}
                     className={cn(
                        'worker-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive ? 'worker-nav-active' : 'worker-nav-idle'
                     )}
                  >
                     <Icon
                        className={cn(
                           'h-4 w-4 shrink-0',
                           isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground'
                        )}
                     />
                     <span className="flex-1">{label}</span>
                     {isActive ? (
                        <ChevronLeft className="h-3.5 w-3.5 text-primary/70" />
                     ) : null}
                  </Link>
               );
            })}

            {/* Notifications panel */}
            <WorkerNotificationPanel onNavigate={onClose} />
         </nav>

         <div className="shrink-0 space-y-3 border-t border-border/60 p-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
               <span className="text-xs font-medium text-muted-foreground">
                  المظهر
               </span>
               <ThemeToggle />
            </div>
            <Separator className="opacity-40" />
            <Button
               variant="ghost"
               size="sm"
               className="h-9 w-full justify-start gap-2.5 rounded-xl text-xs text-muted-foreground transition-colors hover:bg-destructive/8 hover:text-destructive"
               onClick={() => signOut({ callbackUrl: '/' })}
            >
               <LogOut className="h-3.5 w-3.5" />
               <span>تسجيل الخروج</span>
            </Button>
         </div>
      </div>
   );
}

export function WorkerSidebar({ workerName }: WorkerSidebarProps) {
   const { open, toggle, close } = useSidebar();
   const pathname = usePathname();

   return (
      <>
         <aside
            className={cn(
               'worker-sidebar fixed right-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-l border-border/60 shadow-sm transition-all duration-300 ease-in-out lg:flex',
               open ? 'w-72' : 'w-16'
            )}
         >
            {open ? (
               <SidebarInner
                  workerName={workerName}
                  onClose={() => {}}
                  showCloseBtn={false}
               />
            ) : (
               <div className="flex h-full flex-col items-center gap-2 py-4">
                  <div className="worker-logo-icon mb-4 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
                     <Wrench className="h-4 w-4 text-white" />
                  </div>
                  {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                     const isActive =
                        pathname === href || pathname?.startsWith(href + '/');

                     return (
                        <Link
                           key={href}
                           href={href}
                           title={label}
                           className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200',
                              isActive
                                 ? 'border border-primary/25 bg-primary/10 text-primary'
                                 : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                           )}
                        >
                           <Icon className="h-4 w-4" />
                        </Link>
                     );
                  })}
               </div>
            )}
         </aside>

         <button
            onClick={toggle}
            aria-label={open ? 'طي القائمة' : 'توسيع القائمة'}
            className={cn(
               'fixed top-4 z-50 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-all duration-300 hover:text-foreground lg:flex',
               open ? 'right-[268px]' : 'right-[52px]'
            )}
         >
            {open ? (
               <ChevronLeft className="h-4 w-4" />
            ) : (
               <Menu className="h-4 w-4" />
            )}
         </button>

         <button
            className="worker-mobile-toggle fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 lg:hidden"
            onClick={toggle}
            aria-label="فتح القائمة"
         >
            <Menu className="h-5 w-5 text-white" />
         </button>

         <div
            className={cn(
               'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
               open
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0'
            )}
            onClick={close}
         />

         <aside
            className={cn(
               'worker-sidebar fixed right-0 top-0 z-50 flex h-screen w-72 flex-col border-l border-border/60 shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
               open ? 'translate-x-0' : 'translate-x-full'
            )}
         >
            <SidebarInner
               workerName={workerName}
               onClose={close}
               showCloseBtn={true}
            />
         </aside>
      </>
   );
}
