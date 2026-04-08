'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
   return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-background via-muted/30 to-background px-4 py-16">
         <div className="max-w-2xl w-full text-center space-y-4">
            {/* Animated 404 */}
            <div className="relative">
               <div className="text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none">
                  404
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl">🔍</div>
               </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
               <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  الصفحة غير موجودة
               </h1>
               <p className="text-md text-muted-foreground max-w-md mx-auto leading-relaxed">
                  عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم
                  نقلها أو حذفها أو لم تكن موجودة من الأساس.
               </p>
            </div>

            {/* Search Suggestion */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 max-w-sm mx-auto">
               <Search className="h-4 w-4" />
               <span>جرب البحث عن ما تريد أو العودة للصفحة الرئيسية</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
               <Button asChild size="lg" className="min-w-40 gap-2">
                  <Link href="/">
                     <Home className="h-4 w-4" />
                     الصفحة الرئيسية
                  </Link>
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="min-w-40 gap-2"
                  onClick={() => window.history.back()}
               >
                  <ArrowLeft className="h-4 w-4" />
                  رجوع
               </Button>
            </div>
         </div>
      </div>
   );
}
