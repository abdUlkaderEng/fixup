'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ServerOff, RefreshCw, Home, WifiOff } from 'lucide-react';

export default function ServerErrorPage() {
   const router = useRouter();

   const handleRetry = () => {
      // Try to go back to previous page, or home if no history
      if (window.history.length > 1) {
         router.back();
      } else {
         router.push('/');
      }
   };

   return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-destructive/5 via-background to-destructive/5 px-4 py-20">
         <div className="max-w-2xl w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="relative">
               <div className="h-32 w-32 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <ServerOff className="h-16 w-16 text-destructive" />
               </div>
               <div className="absolute bottom-0 right-1/3 h-10 w-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                  <WifiOff className="h-5 w-5" />
               </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
               <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  الخادم غير متاح
               </h1>
               <p className="text-md text-muted-foreground max-w-md mx-auto leading-relaxed">
                  لا يمكن الاتصال بالخادم في الوقت الحالي. قد يكون الخادم متوقف
                  أو هناك مشكلة في الاتصال بالإنترنت.
               </p>
            </div>

            {/* Error Code */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-w-sm mx-auto">
               <p className="text-destructive font-medium">503</p>
               <p className="text-sm text-muted-foreground">
                  Service Unavailable
               </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
               <Button
                  onClick={handleRetry}
                  size="lg"
                  className="min-w-40 gap-2"
               >
                  <RefreshCw className="h-4 w-4" />
                  إعادة المحاولة
               </Button>
               <Button
                  variant="outline"
                  size="lg"
                  className="min-w-40 gap-2"
                  onClick={() => router.push('/')}
               >
                  <Home className="h-4 w-4" />
                  الصفحة الرئيسية
               </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-muted-foreground pt-4">
               إذا استمرت المشكلة، يرجى التواصل مع الدعم الفني
            </p>
         </div>
      </div>
   );
}
