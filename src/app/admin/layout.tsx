'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminHeader, SidebarNav } from '@/components/admin';

/**
 * Admin layout component
 * Provides black/white themed layout with sidebar navigation
 * Refactored: Components extracted following clean code principles
 */
export default function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="min-h-screen bg-white text-gray-900">
         {/* Fixed Sidebar - Desktop */}
         <aside className="fixed right-0 top-0 z-40 hidden h-screen w-64 flex-col border-l border-gray-200 bg-gray-50 lg:flex">
            {/* Logo */}
            <div className="flex h-16 items-center px-5 border-b border-gray-200">
               <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2.5"
               >
                  <div className="h-8 w-8 bg-white text-black flex items-center justify-center font-bold rounded-md">
                     F
                  </div>
                  <div>
                     <span className="text-base font-bold tracking-tight">
                        FIXUP
                     </span>
                     <p className="text-[10px] text-gray-500 leading-tight">
                        لوحة الإدارة
                     </p>
                  </div>
               </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto scrollbar-hover py-3">
               <SidebarNav />
            </div>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-3">
               <div className="flex items-center gap-2.5 mb-3 px-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-700">
                     <span className="text-xs font-bold">A</span>
                  </div>
                  <div className="min-w-0">
                     <p className="text-sm font-medium truncate">المشرف</p>
                     <p className="text-[10px] text-gray-500 truncate">
                        admin@fixup.com
                     </p>
                  </div>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9"
                  onClick={() => signOut({ callbackUrl: '/' })}
               >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">تسجيل الخروج</span>
               </Button>
            </div>
         </aside>

         {/* Main Content Area */}
         <div className="lg:mr-64 flex min-h-screen flex-col">
            <AdminHeader />
            <main className="flex-1 bg-gray-100">{children}</main>
         </div>
      </div>
   );
}
