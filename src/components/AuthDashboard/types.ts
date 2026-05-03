import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AuthDashboardTheme = 'customer' | 'worker';

export interface AuthDashboardStatItem {
   label: string;
   value: number;
   icon: LucideIcon;
}

export interface AuthDashboardHeroAction {
   label: string;
   value: ReactNode;
}
