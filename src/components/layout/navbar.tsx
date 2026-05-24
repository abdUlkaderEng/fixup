'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Menu, User, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/resolve-image-url';
import { NotificationBell } from '@/components/notifications';
import { useCustomerNotifications } from '@/hooks/customer';

const navigationItems = [
   { name: 'الرئيسية', href: '/' },
   { name: 'طلباتي', href: '/customer/orders' },
   { name: 'إنشاء طلب', href: '/customer/orders/create' },
];

interface NavbarProps {
   className?: string;
}

export function Navbar({ className = '' }: NavbarProps) {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const { data: session, status } = useSession();
   const isAuthenticated = status === 'authenticated';

   const { notifications, unreadCount, isLoading, refetch, markRead } =
      useCustomerNotifications({ autoFetch: isAuthenticated });
   const profileImage = session?.user.profile_image;
   const resolvedStoredImage = useMemo(
      () => resolveImageUrl(profileImage),
      [profileImage]
   );

   return (
      <nav
         className={`fixed top-0 left-0 right-0 z-50 w-full  bg-background backdrop-blur supports-backdrop-filter:bg-background/1 ${className}`}
      >
         <div className="container mx-auto px-4">
            <div className="flex h-20 items-center justify-between">
               {/* Logo */}
               <Link href="/" className="max-w-40">
                  <h1 className="text-2xl font-bold">FIXUP</h1>
               </Link>

               {/* Desktop Navigation */}
               <div className="h-full hidden md:flex md:items-center md:gap-8">
                  {navigationItems.map((item, index) => (
                     <Link
                        key={index}
                        href={item.href}
                        className="flex items-center h-full font-medium transition-colors border-b-2 border-transparent hover:border-secondary-foreground"
                     >
                        {item.name}
                     </Link>
                  ))}
               </div>

               {/* Left side actions */}
               <div className="flex items-center space-x-8 space-x-reverse">
                  <ThemeToggle />

                  {/* Notification Bell — desktop, authenticated only */}
                  {isAuthenticated && (
                     <NotificationBell
                        notifications={notifications}
                        unreadCount={unreadCount}
                        isLoading={isLoading}
                        theme="customer"
                        onRefresh={refetch}
                        onMarkRead={markRead}
                     />
                  )}

                  {/* User Icon or Login Button - Desktop */}
                  {isAuthenticated ? (
                     <Link
                        href="/customer/profile"
                        className="hover:scale-110 transition-all duration-300"
                     >
                        <div className="relative w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                           {resolvedStoredImage ? (
                              <Image
                                 src={resolvedStoredImage}
                                 alt={session.user.name || ''}
                                 fill
                                 className="rounded-full object-cover"
                                 unoptimized
                              />
                           ) : (
                              <User className="h-5 w-5 text-primary" />
                           )}
                        </div>
                     </Link>
                  ) : (
                     <Link
                        href="/auth/login"
                        className="hover:translate-x-0.5 transition-all duration-300"
                     >
                        <LogIn className="" />
                     </Link>
                  )}

                  {/* Mobile Menu */}
                  <Sheet
                     open={isMobileMenuOpen}
                     onOpenChange={setIsMobileMenuOpen}
                  >
                     <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                           <Menu className="h-5 w-5" />
                           <span className="sr-only">فتح القائمة</span>
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="right" className="w-75 sm:w-100">
                        <SheetHeader>
                           <SheetTitle className="text-right">
                              القائمة
                           </SheetTitle>
                           <SheetDescription className="text-right">
                              اختر من القائمة أدناه
                           </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col space-y-4 mt-6">
                           {/* Mobile Navigation */}
                           <nav className="flex flex-col space-y-3 text-right">
                              {navigationItems.map((item) => (
                                 <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:text-primary py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    {item.name}
                                 </Link>
                              ))}
                           </nav>

                           {/* Mobile Login/Profile Button */}
                           <div className="pt-4 border-t">
                              {isAuthenticated ? (
                                 <Link
                                    href="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    <Button className="w-full" variant="ghost">
                                       <User className="h-4 w-4 ml-2" />
                                       {session?.user?.name || 'حسابي'}
                                    </Button>
                                 </Link>
                              ) : (
                                 <Link
                                    href="/auth/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                    <Button className="w-full" variant="ghost">
                                       <LogIn className="h-4 w-4 ml-2" />
                                       تسجيل الدخول
                                    </Button>
                                 </Link>
                              )}
                           </div>

                           {/* Notifications — mobile, authenticated only */}
                           {isAuthenticated && (
                              <div className="pt-4 border-t">
                                 <NotificationBell
                                    notifications={notifications}
                                    unreadCount={unreadCount}
                                    isLoading={isLoading}
                                    theme="customer"
                                    onRefresh={refetch}
                                    onMarkRead={markRead}
                                    className="w-full justify-start gap-2 rounded-lg px-3"
                                 />
                              </div>
                           )}

                           {/* User Profile Section */}
                           {isAuthenticated && (
                              <div className="pt-4 border-t">
                                 <Button
                                    className="w-full"
                                    variant="destructive"
                                    onClick={() => {
                                       signOut();
                                       setIsMobileMenuOpen(false);
                                    }}
                                 >
                                    تسجيل الخروج
                                 </Button>
                              </div>
                           )}
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>
      </nav>
   );
}
