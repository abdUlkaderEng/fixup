'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorPageProps {
   error: Error & { digest?: string };
   reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
   useEffect(() => {
      // Log error to monitoring service
      console.error('Application error:', error);
   }, [error]);

   return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-destructive/5 via-background to-destructive/5 px-4 py-16">
         <div className="max-w-2xl w-full text-center space-y-4">
            {/* Error Icon */}
            <div className="relative">
               <div className="h-32 w-32 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-16 w-16 text-destructive" />
               </div>
               <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-sm font-bold">
                  !
               </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
               <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  حدث خطأ ما
               </h1>
               <p className="text-md text-muted-foreground max-w-md mx-auto leading-relaxed">
                  نأسف لذلك، ولكن يبدو أن هناك مشكلة في تحميل هذه الصفحة. يمكنك
                  المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
               </p>
            </div>

            {/* Error Details (collapsible in production) */}
            {error.message && (
               <div className="bg-muted rounded-lg p-4 max-w-lg mx-auto text-left">
                  <div className="flex items-center gap-2 text-destructive mb-2">
                     <Bug className="h-4 w-4" />
                     <span className="text-sm font-medium">تفاصيل الخطأ:</span>
                  </div>
                  <code className="text-xs text-muted-foreground block overflow-x-auto">
                     {error.message}
                  </code>
                  {error.digest && (
                     <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                        معرف الخطأ: {error.digest}
                     </div>
                  )}
               </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
               <Button
                  onClick={reset}
                  size="lg"
                  className="min-w-40 gap-2"
                  variant="default"
               >
                  <RefreshCw className="h-4 w-4" />
                  المحاولة مرة أخرى
               </Button>
               <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-w-40 gap-2"
               >
                  <Link href="/">
                     <Home className="h-4 w-4" />
                     الصفحة الرئيسية
                  </Link>
               </Button>
            </div>

            {/* Help Text */}
            <p className="text-sm text-muted-foreground pt-4">
               إذا استمرت المشكلة، يرجى الاتصال بفريق الدعم
            </p>
         </div>
      </div>
   );
}
