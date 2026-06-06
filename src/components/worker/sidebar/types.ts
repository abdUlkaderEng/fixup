import type { LucideIcon } from 'lucide-react';
import type { useWorkerNotifications } from '@/hooks/worker';

export type WorkerNotification = ReturnType<
   typeof useWorkerNotifications
>['notifications'][number];

export interface ResolvedNavLink {
   href: string;
   label: string;
   /** Compact label used by the mobile bottom tab bar. */
   shortLabel: string;
   icon: LucideIcon;
   isActive: boolean;
}
