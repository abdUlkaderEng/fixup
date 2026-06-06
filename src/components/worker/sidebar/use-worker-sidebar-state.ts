'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
   CheckCircle2,
   Clock3,
   LayoutDashboard,
   User,
   Wallet,
} from 'lucide-react';
import { useWorkerNotifications } from '@/hooks/worker';
import { useSidebar } from './sidebar-context';
import type { ResolvedNavLink } from './types';

const NAV_LINKS = [
   {
      href: '/worker/dashboard',
      label: 'لوحة التحكم',
      shortLabel: 'الرئيسية',
      icon: LayoutDashboard,
   },
   {
      href: '/worker/offers',
      label: 'عروضي المرسلة',
      shortLabel: 'عروضي',
      icon: Clock3,
   },
   {
      href: '/worker/confirmed-orders',
      label: 'الطلبات المؤكدة',
      shortLabel: 'المؤكدة',
      icon: CheckCircle2,
   },
   {
      href: '/worker/wallet',
      label: 'محفظتي',
      shortLabel: 'المحفظة',
      icon: Wallet,
   },
   {
      href: '/worker/profile',
      label: 'الملف الشخصي',
      shortLabel: 'حسابي',
      icon: User,
   },
] as const;

export function useWorkerSidebarState() {
   const { open, toggle, close } = useSidebar();
   const pathname = usePathname();
   const [notifOpen, setNotifOpen] = useState(false);
   const notifications = useWorkerNotifications();

   const navLinks: ResolvedNavLink[] = NAV_LINKS.map(
      ({ href, label, shortLabel, icon }) => ({
         href,
         label,
         shortLabel,
         icon,
         isActive: pathname === href || pathname?.startsWith(href + '/'),
      })
   );

   return {
      open,
      toggle,
      close,
      notifOpen,
      openNotif: () => setNotifOpen(true),
      closeNotif: () => setNotifOpen(false),
      navLinks,
      notifications,
   };
}
