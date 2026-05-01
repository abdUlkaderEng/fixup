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
import { useSidebar } from './sidebar-context';

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
         {/* Header */}
         <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-border/60">
            <Link
               href="/worker/dashboard"
               className="flex items-center gap-2.5"
               onClick={onClose}
            >
               <div className="worker-logo-icon h-8 w-8 rounded-lg flex items-center justify-center shadow-sm">
                  <Wrench className="h-4 w-4 text-white" />
               </div>
               <div>
                  <span className="text-base font-bold tracking-tight text-foreground">
                     FIXUP
                  </span>
                  <p className="text-[10px] text-secondary leading-tight font-medium">
                     منطقة الفني
                  </p>
               </div>
            </Link>
            {showCloseBtn && (
               <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                  aria-label="إغلاق القائمة"
               >
                  <X className="h-5 w-5" />
               </button>
            )}
         </div>

         {/* Worker Identity */}
         <div className="px-4 py-4 border-b border-border/40">
            <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl worker-identity-card">
               <div className="worker-avatar h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-sm">
                  {initial}
               </div>
               <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                     {workerName}
                  </p>
                  <p className="text-[11px] text-secondary font-medium">
                     فني معتمد
                  </p>
               </div>
            </div>
         </div>

         {/* Navigation */}
         <nav className="flex-1 overflow-y-auto scrollbar-hover px-3 py-4 space-y-1">
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
                              ? 'text-secondary'
                              : 'text-muted-foreground group-hover:text-foreground'
                        )}
                     />
                     <span className="flex-1">{label}</span>
                     {isActive && (
                        <ChevronLeft className="h-3.5 w-3.5 text-secondary/70" />
                     )}
                  </Link>
               );
            })}
         </nav>

         {/* Bottom */}
         <div className="shrink-0 border-t border-border/60 p-4 space-y-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40">
               <span className="text-xs text-muted-foreground font-medium">
                  المظهر
               </span>
               <ThemeToggle />
            </div>
            <Separator className="opacity-40" />
            <Button
               variant="ghost"
               size="sm"
               className="w-full justify-start gap-2.5 h-9 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-xl transition-colors"
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
         {/* ── Desktop sidebar ────────────────────────────────────── */}
         {/* Collapsed rail (icons only) when closed, full panel when open */}
         <aside
            className={cn(
               'worker-sidebar fixed right-0 top-0 z-40 hidden lg:flex flex-col h-screen border-l border-border/60 shadow-sm transition-all duration-300 ease-in-out overflow-hidden',
               open ? 'w-72' : 'w-16'
            )}
         >
            {open ? (
               <SidebarInner
                  workerName={workerName}
                  onClose={() => {}} // desktop: don't auto-close on nav
                  showCloseBtn={false}
               />
            ) : (
               /* Collapsed rail */
               <div className="flex flex-col items-center h-full py-4 gap-2">
                  <div className="worker-logo-icon h-8 w-8 rounded-lg flex items-center justify-center shadow-sm mb-4">
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
                              'flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200',
                              isActive
                                 ? 'bg-secondary/10 text-secondary border border-secondary/25'
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

         {/* Desktop toggle button — sits on the sidebar edge */}
         <button
            onClick={toggle}
            aria-label={open ? 'طي القائمة' : 'توسيع القائمة'}
            className={cn(
               'fixed top-4 z-50 hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-card border border-border shadow-md text-muted-foreground hover:text-foreground transition-all duration-300',
               open ? 'right-[268px]' : 'right-[52px]'
            )}
         >
            {open ? (
               <ChevronLeft className="h-4 w-4" />
            ) : (
               <Menu className="h-4 w-4" />
            )}
         </button>

         {/* ── Mobile hamburger ───────────────────────────────────── */}
         <button
            className="worker-mobile-toggle fixed top-4 right-4 z-50 flex lg:hidden items-center justify-center h-10 w-10 rounded-xl transition-all duration-200"
            onClick={toggle}
            aria-label="فتح القائمة"
         >
            <Menu className="h-5 w-5 text-white" />
         </button>

         {/* ── Mobile backdrop ────────────────────────────────────── */}
         <div
            className={cn(
               'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300',
               open
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
            )}
            onClick={close}
         />

         {/* ── Mobile sidebar ─────────────────────────────────────── */}
         <aside
            className={cn(
               'worker-sidebar fixed right-0 top-0 z-50 flex h-screen w-72 flex-col lg:hidden border-l border-border/60 shadow-xl transition-transform duration-300 ease-in-out',
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
