'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { SectionPanel } from '@/components/ui';
import type { AuthDashboardTheme } from './types';

interface AuthDashboardListSectionProps {
   theme: AuthDashboardTheme;
   title: string;
   icon: ReactNode;
   isLoading: boolean;
   loadingText: string;
   children: ReactNode;
}

export function AuthDashboardListSection({
   theme,
   title,
   icon,
   isLoading,
   loadingText,
   children,
}: AuthDashboardListSectionProps) {
   return (
      <div data-dashboard-theme={theme}>
         <SectionPanel title={title} icon={icon} className="border-border/60">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm">{loadingText}</p>
               </div>
            ) : (
               children
            )}
         </SectionPanel>
      </div>
   );
}

export default AuthDashboardListSection;
