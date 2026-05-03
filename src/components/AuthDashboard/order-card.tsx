'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AuthDashboardTheme } from './types';

interface AuthDashboardOrderCardProps {
   children: ReactNode;
   theme: AuthDashboardTheme;
   className?: string;
}

export function AuthDashboardOrderCard({
   children,
   theme,
   className,
}: AuthDashboardOrderCardProps) {
   return (
      <article
         data-dashboard-theme={theme}
         className={cn(
            'app-section-panel border-border/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md sm:p-5',
            className
         )}
      >
         {children}
      </article>
   );
}

interface AuthDashboardMetaGridProps {
   children: ReactNode;
   columnsClassName?: string;
}

export function AuthDashboardMetaGrid({
   children,
   columnsClassName = 'sm:grid-cols-3',
}: AuthDashboardMetaGridProps) {
   return (
      <div
         className={cn(
            'grid gap-3 rounded-2xl border border-border/60 bg-muted/35 p-3',
            columnsClassName
         )}
      >
         {children}
      </div>
   );
}

interface AuthDashboardMetaItemProps {
   icon: ReactNode;
   label: string;
   value: ReactNode;
}

export function AuthDashboardMetaItem({
   icon,
   label,
   value,
}: AuthDashboardMetaItemProps) {
   return (
      <div className="flex items-center gap-2 text-sm">
         <span className="text-primary">{icon}</span>
         <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="font-medium text-foreground">{value}</div>
         </div>
      </div>
   );
}

interface AuthDashboardChipProps {
   children: ReactNode;
   tone?: 'primary' | 'neutral';
}

export function AuthDashboardChip({
   children,
   tone = 'primary',
}: AuthDashboardChipProps) {
   return (
      <span
         className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium',
            tone === 'primary'
               ? 'border-primary/12 bg-primary/5 text-primary'
               : 'border-border bg-background text-muted-foreground'
         )}
      >
         {children}
      </span>
   );
}

interface AuthDashboardActionPillProps {
   children: ReactNode;
   className?: string;
}

export function AuthDashboardActionPill({
   children,
   className,
}: AuthDashboardActionPillProps) {
   return (
      <div
         className={cn(
            'inline-flex items-center gap-2 self-start rounded-xl border border-primary/10 bg-primary/3 px-3 py-2 text-sm font-medium text-primary',
            className
         )}
      >
         {children}
      </div>
   );
}

export default AuthDashboardOrderCard;
