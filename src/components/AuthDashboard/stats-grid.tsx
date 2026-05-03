'use client';

import type { AuthDashboardStatItem, AuthDashboardTheme } from './types';

interface AuthDashboardStatsGridProps {
   items: AuthDashboardStatItem[];
   theme: AuthDashboardTheme;
}

export function AuthDashboardStatsGrid({
   items,
   theme,
}: AuthDashboardStatsGridProps) {
   return (
      <section
         data-dashboard-theme={theme}
         className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
         {items.map((item) => {
            const Icon = item.icon;

            return (
               <div
                  key={item.label}
                  className="app-section-panel border-border/60 p-4"
               >
                  <div className="flex items-center justify-between gap-3">
                     <div>
                        <p className="text-2xl font-bold text-foreground">
                           {item.value}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                           {item.label}
                        </p>
                     </div>

                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                     </div>
                  </div>
               </div>
            );
         })}
      </section>
   );
}

export default AuthDashboardStatsGrid;
