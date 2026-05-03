'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AuthDashboardTheme } from './types';

interface AuthDashboardPageShellProps {
   children: ReactNode;
   theme: AuthDashboardTheme;
   className?: string;
}

export function AuthDashboardPageShell({
   children,
   theme,
   className,
}: AuthDashboardPageShellProps) {
   return (
      <div
         data-dashboard-theme={theme}
         className={cn(
            'app-page-gradient app-page-spacing',
            theme === 'worker' && 'worker-dashboard-shell',
            className
         )}
      >
         <div className="container mx-auto px-4">{children}</div>
      </div>
   );
}

export default AuthDashboardPageShell;
