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

            const active = (isActive && !hasModal) || isModalActive;

            return (
               <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                     'group flex items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium transition-all duration-200',
                     active
                        ? 'border-[#13377b]/15 bg-[#13377b]/[0.07] text-[#13377b]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#13377b]'
                  )}
                  title={item.description}
               >
                  <span
                     className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                        active
                           ? 'bg-[#13377b] text-white shadow-sm'
                           : 'bg-[#13377b]/10 text-[#13377b] group-hover:bg-[#13377b]/15'
                     )}
                  >
                     <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {active ? (
                     <ChevronLeft className="h-4 w-4 shrink-0 opacity-60" />
                  ) : null}
               </Link>
            );
         })}
      </nav>
   );
}
