'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AdminHeader, SidebarNav } from '@/components/admin';
import { useAuthToken } from '@/hooks/use-auth-token';
import { resolveImageUrl } from '@/lib/resolve-image-url';

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
   // Sync Bearer token from NextAuth session to axios for all API calls
   useAuthToken();

   const { data: session } = useSession();
   const adminName = session?.user?.name || 'المشرف';
   const adminEmail = session?.user?.email || 'admin@fixup.com';
   const adminInitial = adminName.charAt(0).toUpperCase();
   const adminImage = resolveImageUrl(session?.user?.profile_image);

   return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
         {/* Fixed Sidebar - Desktop */}
         <aside className="fixed right-0 top-0 z-40 hidden h-screen w-64 flex-col border-l border-gray-200 bg-white lg:flex">
            {/* Logo */}
            <div className="flex h-16 items-center px-5 border-b border-gray-200">
               <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2.5"
               >
                  <div className="h-8 w-8 bg-[#13377b] text-white flex items-center justify-center font-bold rounded-md shadow-sm">
                     F
                  </div>
                  <div>
                     <span className="text-base font-bold tracking-tight text-gray-900">
                        FIXUP
                     </span>
                     <p className="text-[10px] text-[#13377b]/60 leading-tight font-medium">
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
            <div className="border-t border-gray-200 bg-gray-50/50 p-3">
               <div className="flex items-center gap-2.5 mb-2 px-2 py-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-[#13377b]/10 flex items-center justify-center shrink-0 text-[#13377b]">
                     {adminImage ? (
                        <Image
                           src={adminImage}
                           alt={adminName}
                           width={32}
                           height={32}
                           className="h-8 w-8 rounded-full object-cover"
                        />
                     ) : (
                        <span className="text-xs font-bold">
                           {adminInitial}
                        </span>
                     )}
                  </div>
                  <div className="min-w-0">
                     <p className="text-sm font-semibold text-gray-900 truncate">
                        {adminName}
                     </p>
                     <p className="text-[10px] text-gray-400 truncate">
                        {adminEmail}
                     </p>
                  </div>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 admin-btn-ghost h-9 text-xs"
                  onClick={() => signOut({ callbackUrl: '/' })}
               >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>تسجيل الخروج</span>
               </Button>
            </div>
         </aside>

         {/* Main Content Area */}
         <div className="lg:mr-64 flex min-h-screen flex-col">
            <AdminHeader />
            <main className="flex-1">{children}</main>
         </div>
      </div>
   );
}
