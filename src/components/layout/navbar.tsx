'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
   Menu,
   User,
   LogIn,
   LogOut,
   Home,
   ChevronLeft,
   Moon,
   type LucideIcon,
} from 'lucide-react';

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

   const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
               <div className="flex items-center gap-2 sm:gap-4">
                  {/* Theme toggle — desktop only (mobile toggles it from the menu) */}
                  <div className="hidden md:flex">
                     <ThemeToggle />
                  </div>

                  {/* Notification Bell — authenticated only */}
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

                  {/* User / Login icon — desktop only (mobile uses the bottom nav) */}
                  <div className="hidden md:block">
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
                           <LogIn />
                        </Link>
                     )}
                  </div>

                  {/* Mobile menu — account & settings */}
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
                     <SheetContent
                        side="right"
                        showCloseButton={false}
                        className="flex w-80 flex-col p-0"
                     >
                        {/* Identity / greeting */}
                        <SheetHeader className="border-b p-4">
                           {isAuthenticated ? (
                              <div className="flex items-center gap-3 text-right">
                                 <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-primary/10">
                                    {resolvedStoredImage ? (
                                       <Image
                                          src={resolvedStoredImage}
                                          alt={session.user.name || ''}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                       />
                                    ) : (
                                       <span className="flex h-full w-full items-center justify-center">
                                          <User className="size-5 text-primary" />
                                       </span>
                                    )}
                                 </div>
                                 <div className="min-w-0">
                                    <SheetTitle className="truncate text-base">
                                       {session?.user?.name || 'حسابي'}
                                    </SheetTitle>
                                    <SheetDescription className="text-xs">
                                       عميل
                                    </SheetDescription>
                                 </div>
                              </div>
                           ) : (
                              <div className="text-right">
                                 <SheetTitle className="text-base">
                                    مرحبًا بك في FIXUP
                                 </SheetTitle>
                                 <SheetDescription>
                                    سجّل الدخول للوصول إلى طلباتك وإنشاء طلب
                                    جديد
                                 </SheetDescription>
                              </div>
                           )}
                        </SheetHeader>

                        {/* Quick links / settings */}
                        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                           {isAuthenticated ? (
                              <MobileMenuLink
                                 href="/customer/profile"
                                 icon={User}
                                 label="حسابي"
                                 onNavigate={closeMobileMenu}
                              />
                           ) : (
                              <MobileMenuLink
                                 href="/"
                                 icon={Home}
                                 label="الرئيسية"
                                 onNavigate={closeMobileMenu}
                              />
                           )}

                           {/* Theme */}
                           <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
                              <span className="flex items-center gap-3 text-sm font-medium">
                                 <Moon className="size-4 text-muted-foreground" />
                                 المظهر
                              </span>
                              <ThemeToggle />
                           </div>
                        </div>

                        {/* Auth action */}
                        <div className="border-t p-3">
                           {isAuthenticated ? (
                              <Button
                                 variant="destructive"
                                 className="w-full justify-center gap-2"
                                 onClick={() => {
                                    signOut();
                                    closeMobileMenu();
                                 }}
                              >
                                 <LogOut className="size-4" />
                                 تسجيل الخروج
                              </Button>
                           ) : (
                              <Link
                                 href="/auth/login"
                                 onClick={closeMobileMenu}
                              >
                                 <Button className="w-full justify-center gap-2">
                                    <LogIn className="size-4" />
                                    تسجيل الدخول
                                 </Button>
                              </Link>
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

interface MobileMenuLinkProps {
   href: string;
   icon: LucideIcon;
   label: string;
   onNavigate?: () => void;
}

function MobileMenuLink({
   href,
   icon: Icon,
   label,
   onNavigate,
}: MobileMenuLinkProps) {
   return (
      <Link
         href={href}
         onClick={onNavigate}
         className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
         <Icon className="size-4 text-muted-foreground" />
         <span className="flex-1">{label}</span>
         <ChevronLeft className="size-4 text-muted-foreground/50" />
      </Link>
   );
}
