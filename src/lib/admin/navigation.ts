/**
 * Admin Navigation Configuration
 * Centralized navigation items for admin sidebar
 */

import {
   Briefcase,
   Users,
   MapPin,
   MessageSquare,
   Star,
   UserPlus,
   Wrench,
} from 'lucide-react';
import type { NavItem } from '@/types/admin';

/**
 * Admin navigation items - Arabic
 */
export const ADMIN_NAVIGATION: NavItem[] = [
   {
      id: 'services',
      label: 'الخدمات',
      href: '/admin/dashboard?modal=services',
      icon: Wrench,
      description: 'إدارة كتالوج الخدمات',
   },
   {
      id: 'careers',
      label: 'المهن',
      href: '/admin/dashboard?modal=careers',
      icon: Briefcase,
      description: 'إدارة المهن المتاحة',
   },
   {
      id: 'customers',
      label: 'العملاء',
      href: '/admin/dashboard?modal=customers',
      icon: Users,
      description: 'حسابات العملاء',
   },
   {
      id: 'addresses',
      label: 'العناوين',
      href: '/admin/dashboard?modal=addresses',
      icon: MapPin,
      description: 'إدارة العناوين',
   },
   {
      id: 'messages',
      label: 'رسائل الدردشة',
      href: '/admin/dashboard?modal=messages',
      icon: MessageSquare,
      description: 'رسائل الدردشة الثابتة',
   },
   {
      id: 'reviews',
      label: 'التقييمات',
      href: '/admin/dashboard?modal=reviews',
      icon: Star,
      description: 'تقييمات العمال',
   },
   {
      id: 'worker-requests',
      label: 'طلبات العمال',
      href: '/admin/dashboard?modal=worker-requests',
      icon: UserPlus,
      description: 'إدارة طلبات التسجيل',
   },
];
