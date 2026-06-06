'use client';

import { createContext, useContext, useState } from 'react';

interface SidebarContextValue {
   open: boolean;
   toggle: () => void;
   close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
   // Desktop sidebar starts expanded. On mobile the sidebar is replaced by the
   // bottom tab bar, so this only governs the desktop expand/collapse state.
   const [open, setOpen] = useState(true);
   const toggle = () => setOpen((v) => !v);
   const close = () => setOpen(false);
   return (
      <SidebarContext.Provider value={{ open, toggle, close }}>
         {children}
      </SidebarContext.Provider>
   );
}

export function useSidebar() {
   const ctx = useContext(SidebarContext);
   if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
   return ctx;
}
