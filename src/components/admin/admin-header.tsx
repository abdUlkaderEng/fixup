'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';
import Image from 'next/image';

/**
 * Admin header component
 * Shows logo and mobile menu trigger
 * Only visible on mobile (lg:hidden)
 */
export function AdminHeader() {
   const { data: session } = useSession();
   const adminName = session?.user?.name || 'المشرف';
   const adminInitial = adminName.charAt(0).toUpperCase();

   return (
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
         <div className="flex items-center gap-3">
            <Sheet>
               <SheetTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="text-gray-700 hover:bg-gray-100 h-9 w-9"
                  >
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">فتح القائمة</span>
                  </Button>
               </SheetTrigger>
               <SheetContent
                  side="right"
                  className="w-72 bg-white border-l border-gray-200 p-0"
               >
                  <div className="flex h-full flex-col">
                     <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <span className="text-lg font-semibold text-gray-900">
                           لوحة الإدارة
                        </span>
                     </div>
                     <div className="flex-1 overflow-auto py-4">
                        <SidebarNav />
                     </div>
                     {/* User Profile - Mobile Sheet */}
                     <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-700">
                              {session?.user?.profile_picture ? (
                                 <Image
                                    src={session.user.profile_picture}
                                    alt={adminName}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover"
                                 />
                              ) : (
                                 <User className="h-5 w-5" />
                              )}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                 {adminName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                 {session?.user?.email || 'admin@fixup.com'}
                              </p>
                           </div>
                        </div>
                        <Button
                           variant="outline"
                           className="w-full justify-start gap-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
               <span className="font-bold text-gray-900">FIXUP</span>
            </Link>
         </div>

         {/* Admin Name */}
         <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-700">
               {session?.user?.profile_picture ? (
                  <Image
                     src={session.user.profile_picture}
                     alt={adminName}
                     width={28}
                     height={28}
                     className="h-7 w-7 rounded-full object-cover"
                  />
               ) : (
                  <span className="text-xs font-bold">{adminInitial}</span>
               )}
            </div>
            <span className="text-sm font-medium text-gray-900 hidden sm:block">
               {adminName}
            </span>
         </div>
      </header>
   );
}
