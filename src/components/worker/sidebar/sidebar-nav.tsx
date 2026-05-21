'use client';

import Link from 'next/link';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResolvedNavLink } from './types';

// ---------------------------------------------------------------------------
// NavItem
// ---------------------------------------------------------------------------

interface NavItemProps extends ResolvedNavLink {
   collapsed: boolean;
   onClick?: () => void;
}

function NavItem({
   href,
   label,
   icon: Icon,
   isActive,
   collapsed,
   onClick,
}: NavItemProps) {
   return (
      <Link
         href={href}
         title={collapsed ? label : undefined}
         onClick={onClick}
         className={cn(
            'worker-nav-item group flex items-center rounded-xl transition-all duration-200',
            collapsed
               ? 'mx-auto h-10 w-10 justify-center'
               : 'gap-3 px-3 py-2.5 text-sm font-medium',
            isActive ? 'worker-nav-active' : 'worker-nav-idle'
         )}
      >
         <Icon
            className={cn(
               'h-4 w-4 shrink-0',
               isActive
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground'
            )}
         />
         {!collapsed && <span className="flex-1">{label}</span>}
         {!collapsed && isActive && (
            <ChevronLeft className="h-3.5 w-3.5 text-primary/70" />
         )}
      </Link>
   );
}

// ---------------------------------------------------------------------------
// NavSection
// ---------------------------------------------------------------------------

interface NavSectionProps {
   heading: string;
   collapsed: boolean;
   children: React.ReactNode;
}

function NavSection({ heading, collapsed, children }: NavSectionProps) {
   return (
      <div>
         {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
               {heading}
            </p>
         )}
         {children}
      </div>
   );
}

// ---------------------------------------------------------------------------
// ChatButton
// ---------------------------------------------------------------------------

function ChatButton({ onClick }: { onClick: () => void }) {
   return (
      <button
         type="button"
         onClick={onClick}
         className="worker-nav-item group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 worker-nav-idle"
      >
         <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
         <span className="flex-1 text-right">محادثة تجريبية</span>
      </button>
   );
}

// ---------------------------------------------------------------------------
// SidebarNav — public export
// ---------------------------------------------------------------------------

interface SidebarNavProps {
   navLinks: ResolvedNavLink[];
   collapsed: boolean;
   onNavClick?: () => void;
   onChatOpen: () => void;
}

export function SidebarNav({
   navLinks,
   collapsed,
   onNavClick,
   onChatOpen,
}: SidebarNavProps) {
   return (
      <nav className="scrollbar-hover flex-1 space-y-1 overflow-y-auto px-2 py-4">
         <NavSection heading="القائمة الرئيسية" collapsed={collapsed}>
            {navLinks.map((link) => (
               <NavItem
                  key={link.href}
                  {...link}
                  collapsed={collapsed}
                  onClick={onNavClick}
               />
            ))}
         </NavSection>

         {!collapsed && (
            <NavSection heading="المحادثات" collapsed={false}>
               <ChatButton onClick={onChatOpen} />
            </NavSection>
         )}
      </nav>
   );
}
