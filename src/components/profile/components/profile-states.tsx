'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoadingState() {
   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <CardTitle>جاري التحميل...</CardTitle>
            </CardHeader>
         </Card>
      </div>
   );
}

export function UnauthenticatedState() {
   const router = useRouter();

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center p-4">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <CardTitle>يجب تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
               <p className="text-muted-foreground">
                  يجب أن تكون مسجلاً للدخول لمشاهدة صفحة ملفك الشخصي
               </p>
               <Button onClick={() => router.push('/auth/login')}>
                  تسجيل الدخول
               </Button>
            </CardContent>
         </Card>
      </div>
   );
}
