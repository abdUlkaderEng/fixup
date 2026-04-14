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
   MapPin,
   Cake,
   X,
   Check,
   Loader2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { InfoField } from '@/components/sections/info-field';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useProfileForm } from '@/hooks/use-profile-form';
import { useProfileSubmit } from '@/hooks/use-profile-submit';
import { useLogout } from '@/hooks/use-logout';

export default function ProfilePage() {
   const router = useRouter();
   const { data: session, status } = useSession();
   const user = session?.user;
   const isAuthenticated = status === 'authenticated';

   // Auth token synchronization
   useAuthToken();

   // Form and edit mode management
   const { form, isEditing, handleEdit, handleCancel } = useProfileForm(user);

   // Profile submission handler
   const { isSubmitting, onSubmit } = useProfileSubmit(user, handleCancel);

   // Logout handler
   const handleLogout = useLogout();

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

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="max-w-4xl mx-auto">
            <Link
               href="/"
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة للرئيسية</span>
            </Link>

            <div className="mb-8">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary" />
               </div>
               <h1 className="text-3xl font-bold text-center mb-2">
                  {user.name}
               </h1>
               <p className="text-muted-foreground text-center">{user.email}</p>
            </div>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     {/* Email - Read Only */}
                     <InfoField
                        icon={<Mail className="h-5 w-5 text-primary" />}
                        title="البريد الإلكتروني"
                     >
                        <p className="text-muted-foreground">{user.email}</p>
                        {!user.email_verified_at && (
                           <p className="text-xs text-yellow-500 mt-2">
                              ⚠️ لم يتم تأكيد البريد الإلكتروني
                           </p>
                        )}
                     </InfoField>

                     {/* Phone */}
                     <InfoField
                        icon={<Phone className="h-5 w-5 text-primary" />}
                        title="رقم الهاتف"
                     >
                        {isEditing ? (
                           <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormControl>
                                       <Input
                                          {...field}
                                          placeholder="أدخل رقم الهاتف"
                                          className="text-right"
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        ) : (
                           <p className="text-muted-foreground">
                              {user.phone || 'غير متوفر'}
                           </p>
                        )}
                     </InfoField>

                     {/* Address */}
                     <InfoField
                        icon={<MapPin className="h-5 w-5 text-primary" />}
                        title="العنوان"
                     >
                        {isEditing ? (
                           <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormControl>
                                       <Input
                                          {...field}
                                          value={field.value || ''}
                                          placeholder="أدخل العنوان"
                                          className="text-right"
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        ) : (
                           <p className="text-muted-foreground">
                              {user.address || 'غير متوفر'}
                           </p>
                        )}
                     </InfoField>

                     {/* Birth Date */}
                     <InfoField
                        icon={<Cake className="h-5 w-5 text-primary" />}
                        title="تاريخ الميلاد"
                     >
                        {isEditing ? (
                           <FormField
                              control={form.control}
                              name="birth_date"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormControl>
                                       <Input
                                          {...field}
                                          value={field.value || ''}
                                          type="date"
                                          placeholder="اختر تاريخ الميلاد"
                                          className="text-right"
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        ) : (
                           <p className="text-muted-foreground">
                              {user.birth_date
                                 ? new Date(
                                      user.birth_date
                                   ).toLocaleDateString()
                                 : 'غير متوفر'}
                           </p>
                        )}
                     </InfoField>

                     {/* Role - Read Only */}
                     <InfoField
                        icon={<Shield className="h-5 w-5 text-primary" />}
                        title="نوع الحساب"
                     >
                        <p className="text-muted-foreground">{user.role}</p>
                     </InfoField>

                     {/* Created At - Read Only */}
                     <InfoField
                        icon={<Calendar className="h-5 w-5 text-primary" />}
                        title="تاريخ الإنشاء"
                     >
                        <p className="text-muted-foreground">
                           {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : 'غير متوفر'}
                        </p>
                     </InfoField>
                  </div>

                  <div className="flex gap-3 h-12">
                     {isEditing ? (
                        <>
                           <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={isSubmitting}
                              className="flex-1 h-full gap-2"
                           >
                              <X className="h-4 w-4" />
                              إلغاء
                           </Button>
                           <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="flex-1 h-full gap-2"
                           >
                              {isSubmitting ? (
                                 <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    جاري الحفظ...
                                 </>
                              ) : (
                                 <>
                                    <Check className="h-4 w-4" />
                                    حفظ التغييرات
                                 </>
                              )}
                           </Button>
                        </>
                     ) : (
                        <>
                           <Button
                              type="button"
                              variant="outline"
                              onClick={handleEdit}
                              className="flex-1 h-full gap-2"
                           >
                              <Pencil className="h-4 w-4" />
                              تعديل الملف الشخصي
                           </Button>
                           <Button
                              type="button"
                              variant="destructive"
                              onClick={handleLogout}
                              className="flex-1 h-full gap-2"
                           >
                              <LogOut className="h-4 w-4" />
                              تسجيل الخروج
                           </Button>
                        </>
                     )}
                  </div>
               </form>
            </Form>
         </div>
      </div>
   );
}
