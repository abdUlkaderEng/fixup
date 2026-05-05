'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuthDashboardHeroAction, AuthDashboardTheme } from './types';

interface AuthDashboardHeroProps {
   theme: AuthDashboardTheme;
   backHref: string;
   backLabel: string;
   icon: ReactNode;
   title: string;
   description: string;
   leadingBadge?: ReactNode;
   action?: ReactNode;
   highlight?: AuthDashboardHeroAction;
}

const heroThemeClasses: Record<
   AuthDashboardTheme,
   {
      panel: string;
      iconWrapper: string;
      description: string;
      highlight: string;
      highlightLabel: string;
      highlightValue: string;
   }
> = {
   customer: {
      panel: 'border-primary/10 bg-gradient-to-l from-primary/[0.03] via-card to-card',
      iconWrapper: 'bg-primary text-primary-foreground shadow-sm',
      description: 'text-muted-foreground',
      highlight: 'border-primary/10 bg-primary/[0.03] text-primary',
      highlightLabel: 'text-primary/70',
      highlightValue: 'text-primary',
   },
   worker: {
      panel: 'worker-dashboard-hero border-secondary/10',
      iconWrapper: 'bg-secondary/16 text-secondary shadow-sm backdrop-blur-sm',
      description: 'text-foreground/78',
      highlight:
         'border-secondary/15 bg-secondary/10 text-foreground backdrop-blur-sm',
      highlightLabel: 'text-foreground/70',
      highlightValue: 'text-foreground',
   },
};

export function AuthDashboardHero({
   theme,
   backHref,
   backLabel,
   icon,
   title,
   description,
   leadingBadge,
   action,
   highlight,
}: AuthDashboardHeroProps) {
   const themeClasses = heroThemeClasses[theme];

   return (
      <>
         <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
         >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
         </Link>

         <section
            data-dashboard-theme={theme}
            className={cn(
               'app-section-panel mb-6 overflow-hidden',
               themeClasses.panel
            )}
         >
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
               <div className="space-y-3">
                  <div
                     className={cn(
                        'inline-flex h-12 w-12 items-center justify-center rounded-2xl',
                        themeClasses.iconWrapper
                     )}
                  >
                     {icon}
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {title}
                     </h1>
                     <p
                        className={cn(
                           'mt-1 max-w-2xl text-sm leading-7 sm:text-base',
                           themeClasses.description
                        )}
                     >
                        {description}
                     </p>
                  </div>
               </div>

               {action || highlight ? (
                  <div className="flex flex-col gap-3 sm:flex-row">
                     {highlight ? (
                        <div
                           className={cn(
                              'rounded-2xl border px-4 py-3',
                              themeClasses.highlight
                           )}
                        >
                           <p
                              className={cn(
                                 'text-xs',
                                 themeClasses.highlightLabel
                              )}
                           >
                              {highlight.label}
                           </p>
                           <div
                              className={cn(
                                 'mt-1 text-2xl font-bold',
                                 themeClasses.highlightValue
                              )}
                           >
                              {highlight.value}
                           </div>
                        </div>
                     ) : null}
                     {action}
                  </div>
               ) : null}
            </div>
            {leadingBadge ? <div className="pt-4">{leadingBadge}</div> : null}
         </section>
      </>
   );
}

export default AuthDashboardHero;
