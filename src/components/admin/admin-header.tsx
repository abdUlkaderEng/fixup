'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';

/**
 * Admin header component
 * Shows logo and mobile menu trigger
 * Only visible on mobile (lg:hidden)
 */
export function AdminHeader() {
   return (
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-black px-4">
         <div className="flex items-center gap-3">
            <Sheet>
               <SheetTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="text-white hover:bg-white/10 h-9 w-9"
                  >
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">فتح القائمة</span>
                  </Button>
               </SheetTrigger>
               <SheetContent
                  side="right"
                  className="w-72 bg-black border-l border-white/10 p-0"
               >
                  <div className="flex h-full flex-col">
                     <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
                        <span className="text-lg font-semibold text-white">
                           لوحة الإدارة
                        </span>
                     </div>
                     <div className="flex-1 overflow-auto py-4">
                        <SidebarNav />
                     </div>
                     <div className="border-t border-white/10 p-4">
                        <Button
                           variant="outline"
                           className="w-full justify-start gap-2 border-white/20 bg-transparent text-white hover:bg-white hover:text-black"
                           onClick={() => signOut({ callbackUrl: '/' })}
                        >
                           <LogOut className="h-4 w-4" />
                           تسجيل الخروج
                        </Button>
                     </div>
                  </div>
               </SheetContent>
            </Sheet>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
               <div className="h-7 w-7 bg-white text-black flex items-center justify-center font-bold text-sm rounded">
                  F
               </div>
               <span className="font-bold text-white">FIXUP</span>
            </Link>
         </div>
      </header>
   );
}
