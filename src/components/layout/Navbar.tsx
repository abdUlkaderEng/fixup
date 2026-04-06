'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

const navigationItems = [
   { name: 'الرئيسية', href: '/' },
   { name: 'الخدمات', href: '/services' },
   { name: 'اتصل بنا', href: '/contact' },
];

interface NavbarProps {
   className?: string;
}

export function Navbar({ className = '' }: NavbarProps) {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

                  {/* Login Button - Desktop */}
                  <Link
                     href="/auth/login"
                     className="hover:translate-x-0.5 transition-all duration-300"
                  >
                     <LogIn className="" />
                  </Link>

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
                     <SheetContent
                        side="right"
                        className="w-[300px] sm:w-[400px]"
                     >
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

                           {/* Mobile Login Button */}
                           <div className="pt-4 border-t">
                              <Link
                                 href="/auth/login"
                                 className="hover:translate-x-0.5 transition-all duration-300"
                              >
                                 <LogIn className="" />
                              </Link>
                           </div>

                           {/* User Profile Section */}
                           <div className="pt-4 border-t">
                              <Button className="w-full" variant="ghost">
                                 <User className="h-4 w-4 ml-2" />
                                 حسابي
                              </Button>
                           </div>
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>
      </nav>
   );
}
