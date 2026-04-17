'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAVIGATION } from '@/lib/admin/navigation';

/**
 * Sidebar navigation props
 */
interface SidebarNavProps {
   className?: string;
   onNavigate?: () => void;
}

/**
 * Sidebar navigation component
 * Displays navigation links with active state
 */
export function SidebarNav({ className, onNavigate }: SidebarNavProps) {
   const pathname = usePathname();

   return (
      <nav className={cn('flex flex-col gap-1 p-2', className)}>
         {ADMIN_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href.split('?')[0];
            const hasModal = item.href.includes('?');
            const isModalActive = pathname === '/admin/dashboard' && hasModal;

            return (
               <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                     'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg',
                     'bg-transparent hover:bg-gray-100 group border border-transparent',
                     (isActive && !hasModal) || isModalActive
                        ? 'bg-gray-200 text-gray-900 border-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                  )}
                  title={item.description}
               >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {(isActive && !hasModal) || isModalActive ? (
                     <ChevronLeft className="h-4 w-4 shrink-0 opacity-60" />
                  ) : null}
               </Link>
            );
         })}
      </nav>
   );
}
