'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
   ArrowLeft,
   User,
   Mail,
   Phone,
   Calendar,
   Shield,
   Pencil,
   LogOut,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
   const router = useRouter();
   const { data: session, status } = useSession();
   const isAuthenticated = status === 'authenticated';
   const user = session?.user;
   console.log(user);
   if (status === 'loading') {
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

   if (!isAuthenticated || !user) {
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

   const handleLogout = () => {
      toast.warning('هل تريد تسجيل الخروج؟', {
         description: 'سيتم إنهاء جلستك الحالية',
         action: {
            label: 'تأكيد',
            onClick: async () => {
               try {
                  // Call backend logout to invalidate token
                  const { authApi } = await import('@/api/auth');
                  await authApi.logout();

                  await signOut({ redirect: false });
                  toast.success('تم تسجيل الخروج بنجاح');
                  router.push('/');
               } catch {
                  toast.error('حدث خطأ أثناء تسجيل الخروج', {
                     description:
                        'لا يمكن الاتصال بالخادم، يرجى المحاولة لاحقاً',
                  });
               }
            },
         },
         cancel: {
            label: 'إلغاء',
            onClick: () => {},
         },
      });
   };

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
               href="/"
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة للرئيسية</span>
            </Link>

            {/* Profile Header */}
            <div className="mb-8">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary" />
               </div>
               <h1 className="text-3xl font-bold text-center mb-2">
                  {user.name}
               </h1>
               <p className="text-muted-foreground text-center">{user.email}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        البريد الإلكتروني
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">{user.email}</p>
                     {!user.email_verified_at && (
                        <p className="text-xs text-yellow-500 mt-2">
                           ⚠️ لم يتم تأكيد البريد الإلكتروني
                        </p>
                     )}
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        رقم الهاتف
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">
                        {user.phone || 'غير متوفر'}
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        نوع الحساب
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">{user.role}</p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        تاريخ الإنشاء
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">
                        {user.created_at
                           ? new Date(user.created_at).toLocaleDateString()
                           : 'غير متوفر'}
                     </p>
                  </CardContent>
               </Card>
            </div>

            {/* Actions */}
            <div className="w-1/2 h-12 flex  gap-3">
               <Button variant="outline" className="w-full h-full gap-2">
                  <Pencil className="h-4 w-4" />
                  تعديل الملف الشخصي
               </Button>
               <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full h-full gap-2"
               >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
               </Button>
            </div>
         </div>
      </div>
   );
}
