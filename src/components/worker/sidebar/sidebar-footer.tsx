'use client';

import { Bell, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { UnreadBadge } from './unread-badge';

interface SidebarFooterProps {
   collapsed: boolean;
   unreadCount: number;
   onNotificationOpen: () => void;
}

export function SidebarFooter({
   collapsed,
   unreadCount,
   onNotificationOpen,
}: SidebarFooterProps) {
   return (
      <div className="shrink-0 border-t border-border/60 p-3">
         <button
            type="button"
            onClick={onNotificationOpen}
            aria-label="الإشعارات"
            className={cn(
               'group relative flex items-center rounded-xl transition-all duration-200 worker-nav-idle',
               collapsed
                  ? 'mx-auto h-10 w-10 justify-center'
                  : 'w-full gap-3 px-3 py-2.5 text-sm font-medium'
            )}
         >
            <Bell className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span className="flex-1 text-right">الإشعارات</span>}
            <UnreadBadge count={unreadCount} inline={!collapsed} />
         </button>

         {!collapsed && (
            <>
               <Separator className="my-2 opacity-40" />
               <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">
                     المظهر
                  </span>
                  <ThemeToggle />
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-9 w-full justify-start gap-2.5 rounded-xl text-xs text-muted-foreground transition-colors hover:bg-destructive/8 hover:text-destructive"
                  onClick={() => signOut({ callbackUrl: '/' })}
               >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>تسجيل الخروج</span>
               </Button>
            </>
         )}
      </div>
   );
}
