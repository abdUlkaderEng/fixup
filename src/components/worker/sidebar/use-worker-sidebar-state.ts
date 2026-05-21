'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User } from 'lucide-react';
import { useWorkerNotifications } from '@/hooks/worker';
import { useSidebar } from '../sidebar-context';
import type { ResolvedNavLink } from './types';

const NAV_LINKS = [
   { href: '/worker/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
   { href: '/worker/profile', label: 'الملف الشخصي', icon: User },
] as const;

export function useWorkerSidebarState() {
   const { open, toggle, close } = useSidebar();
   const pathname = usePathname();
   const [chatOpen, setChatOpen] = useState(false);
   const [notifOpen, setNotifOpen] = useState(false);
   const notifications = useWorkerNotifications();

   const navLinks: ResolvedNavLink[] = NAV_LINKS.map(
      ({ href, label, icon }) => ({
         href,
         label,
         icon,
         isActive: pathname === href || pathname?.startsWith(href + '/'),
      })
   );

   return {
      open,
      toggle,
      close,
      chatOpen,
      openChat: () => setChatOpen(true),
      closeChat: () => setChatOpen(false),
      notifOpen,
      openNotif: () => setNotifOpen(true),
      closeNotif: () => setNotifOpen(false),
      navLinks,
      notifications,
   };
}
