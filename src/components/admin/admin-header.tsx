'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarNav } from './sidebar-nav';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/resolve-image-url';

/**
 * Admin header component
 * Shows logo and mobile menu trigger
 * Only visible on mobile (lg:hidden)
 */
export function AdminHeader() {
   const { data: session } = useSession();
   const adminName = session?.user?.name || 'المشرف';
   const adminInitial = adminName.charAt(0).toUpperCase();
   const adminImage = resolveImageUrl(session?.user?.profile_picture);

   return (
      <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
         <div className="flex items-center gap-3">
            <Sheet>
               <SheetTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="admin-btn-ghost h-9 w-9"
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
                     {/* Sheet Header - matches desktop sidebar logo area */}
                     <div className="flex h-16 items-center px-5 border-b border-gray-200">
                        <div className="flex items-center gap-2.5">
                           <div className="h-7 w-7 bg-[#13377b] text-white flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
                              F
                           </div>
                           <div>
                              <span className="text-sm font-bold tracking-tight text-gray-900">
                                 FIXUP
                              </span>
                              <p className="text-[10px] text-[#13377b]/60 leading-tight font-medium">
                                 لوحة الإدارة
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="flex-1 overflow-auto py-3">
                        <SidebarNav />
                     </div>
                     {/* User Profile - Mobile Sheet */}
                     <div className="border-t border-gray-200 bg-gray-50/50 p-3">
                        <div className="flex items-center gap-3 mb-2 px-1 py-2 rounded-lg">
                           <div className="h-9 w-9 rounded-full bg-[#13377b]/10 flex items-center justify-center shrink-0 text-[#13377b]">
                              {adminImage ? (
                                 <Image
                                    src={adminImage}
                                    alt={adminName}
                                    width={36}
                                    height={36}
                                    className="h-9 w-9 rounded-full object-cover"
                                 />
                              ) : (
                                 <User className="h-4 w-4" />
                              )}
                           </div>
                           <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                 {adminName}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                 {session?.user?.email || 'admin@fixup.com'}
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
                           تسجيل الخروج
                        </Button>
                     </div>
                  </div>
               </SheetContent>
            </Sheet>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
               <div className="h-7 w-7 bg-[#13377b] text-white flex items-center justify-center font-bold text-sm rounded-md shadow-sm">
                  F
               </div>
               <div>
                  <span className="font-bold text-gray-900 text-sm">FIXUP</span>
                  <p className="text-[9px] text-[#13377b]/60 font-medium leading-tight hidden sm:block">
                     لوحة الإدارة
                  </p>
               </div>
            </Link>
         </div>

         {/* Admin avatar */}
         <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#13377b]/10 flex items-center justify-center shrink-0 text-[#13377b]">
               {adminImage ? (
                  <Image
                     src={adminImage}
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
