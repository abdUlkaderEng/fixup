'use client';

import { Button } from '@/components/ui/button';
import { Server, RefreshCw, AlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
   error: Error & { digest?: string };
   reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
   return (
      <html lang="ar" dir="rtl">
         <body className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-br from-destructive/10 via-background to-destructive/10 px-4 py-16">
            <div className="max-w-2xl w-full text-center space-y-4">
               {/* Server Error Icon */}
               <div className="relative">
                  <div className="h-40 w-40 mx-auto rounded-full bg-destructive/10 flex items-center justify-center border-4 border-destructive/20">
                     <Server className="h-20 w-20 text-destructive" />
                  </div>
                  <div className="absolute top-0 right-1/3 h-10 w-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                     <AlertTriangle className="h-5 w-5" />
                  </div>
               </div>

               {/* Content */}
               <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                     خطأ في الخادم
                  </h1>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-lg mx-auto">
                     <p className="text-md text-destructive font-medium">500</p>
                     <p className="text-muted-foreground">
                        Internal Server Error
                     </p>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                     نأسف، يوجد مشكلة فنية في الخادم. فريقنا يعمل على إصلاحها.
                     يرجى المحاولة مرة أخرى لاحقاً.
                  </p>
               </div>

               {/* Error ID */}
               {error.digest && (
                  <div className="bg-muted rounded-lg py-2 px-4 inline-block">
                     <span className="text-sm text-muted-foreground">
                        معرف الخطأ:{' '}
                        <code className="text-foreground">{error.digest}</code>
                     </span>
                  </div>
               )}

               {/* Action */}
               <div className="pt-4">
                  <Button onClick={reset} size="lg" className="min-w-50 gap-2">
                     <RefreshCw className="h-4 w-4" />
                     إعادة تحميل التطبيق
                  </Button>
               </div>

               {/* Support Info */}
               <div className="pt-8 border-t border-border max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground">
                     إذا استمرت المشكلة، يرجى التواصل معنا على{' '}
                     <a
                        href="mailto:support@fixup.com"
                        className="text-primary hover:underline"
                     >
                        support@fixup.com
                     </a>
                  </p>
               </div>
            </div>
         </body>
      </html>
   );
}
