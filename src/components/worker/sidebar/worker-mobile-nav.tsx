'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ResolvedNavLink } from './types';

interface WorkerMobileNavProps {
   navLinks: ResolvedNavLink[];
}

/**
 * Fixed bottom tab bar for workers on mobile (`<xl`). Surfaces the same
 * navigation the desktop sidebar shows, as thumb-reachable tabs — replacing the
 * old hamburger drawer. Inherits the worker theme (gold `--primary`) from the
 * surrounding `.worker-theme` layout.
 */
export function WorkerMobileNav({ navLinks }: WorkerMobileNavProps) {
   return (
      <nav
         aria-label="التنقل السريع"
         className="worker-sidebar fixed inset-x-0 bottom-0 z-50 border-t border-border/60 pb-[env(safe-area-inset-bottom)] xl:hidden"
      >
         <div className="flex h-16 items-stretch justify-around px-1">
            {navLinks.map((link) => {
               const Icon = link.icon;
               return (
                  <Link
                     key={link.href}
                     href={link.href}
                     aria-current={link.isActive ? 'page' : undefined}
                     className="group flex flex-1 flex-col items-center justify-center gap-1 px-0.5"
                  >
                     <span
                        className={cn(
                           'flex size-9 items-center justify-center rounded-xl transition-colors',
                           link.isActive ? 'bg-primary/10' : 'bg-transparent'
                        )}
                     >
                        <Icon
                           className={cn(
                              'size-5 shrink-0',
                              link.isActive
                                 ? 'text-primary'
                                 : 'text-muted-foreground'
                           )}
                        />
                     </span>
                     <span
                        className={cn(
                           'text-[10px] font-medium leading-none',
                           link.isActive
                              ? 'text-primary'
                              : 'text-muted-foreground'
                        )}
                     >
                        {link.shortLabel}
                     </span>
                  </Link>
               );
            })}
         </div>
      </nav>
   );
}

export default WorkerMobileNav;
