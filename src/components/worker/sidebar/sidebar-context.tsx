'use client';

import { createContext, useContext, useState } from 'react';

interface SidebarContextValue {
   open: boolean;
   toggle: () => void;
   close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
   const [open, setOpen] = useState(false);
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
