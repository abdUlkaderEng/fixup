'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
   Eye,
   EyeOff,
   Loader2,
   User,
   Mail,
   Lock,
   Phone,
   MapPin,
   Calendar,
   ArrowLeft,
   Check,
   X,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floating-input';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { signupSchema, type SignupInput } from '../schemas';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';

export default function SignupPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<SignupInput>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         fullName: '',
         email: '',
         phone: '',
         address: '',
         birthDate: '',
         password: '',
         confirmPassword: '',
         termsAccepted: false,
      },
   });

   const password = form.watch('password');

   const passwordRequirements = [
      { label: '8 أحرف على الأقل', met: password?.length >= 8 },
      { label: 'حرف كبير واحد', met: /[A-Z]/.test(password || '') },
      { label: 'حرف صغير واحد', met: /[a-z]/.test(password || '') },
      { label: 'رقم واحد', met: /[0-9]/.test(password || '') },
      { label: 'رمز خاص', met: /[^A-Za-z0-9]/.test(password || '') },
   ];

   const router = useRouter();

   const onSubmit = async (data: SignupInput) => {
      setIsLoading(true);
      try {
         await authApi.register({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            birth_date: data.birthDate,
            password: data.password,
            password_confirmation: data.confirmPassword,
         });
         toast.success('تم إنشاء الحساب بنجاح!', {
            description: 'بإمكانك الآن تسجيل الدخول',
         });
         router.push('/auth/login');
      } catch (error) {
         // Check if server is down (network error)
         if (
            error instanceof Error &&
            (error.message.includes('fetch') ||
               error.message.includes('NetworkError') ||
               error.message.includes('Failed to fetch') ||
               error.message.includes('Network Error'))
         ) {
            router.push('/server-error');
            return;
         }
         const message =
            error instanceof Error
               ? error.message
               : 'حدث خطأ أثناء إنشاء الحساب';
         toast.error('فشل إنشاء الحساب', {
            description: message,
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="w-full max-w-lg">
            {/* Back Button */}
            <Link
               href="/"
               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة للرئيسية</span>
            </Link>

            {/* Card */}
            <div className="bg-card border rounded-2xl shadow-lg p-6 sm:p-8">
               {/* Header */}
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <User className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
                  <p className="text-muted-foreground text-sm">
                     أنشئ حسابك الآن واكتشف خدماتنا المميزة
                  </p>
               </div>

               {/* Form */}
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-5"
                  >
                     {/* Full Name Field */}
                     <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <User className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                 <FloatingLabelInput
                                    {...field}
                                    label="الاسم الكامل"
                                    type="text"
                                    placeholder="محمد أحمد"
                                    className="pr-8"
                                    disabled={isLoading}
                                    error={!!fieldState.error}
                                 />
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Email & Phone Row */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="email"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <Mail className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                    <FloatingLabelInput
                                       {...field}
                                       label="البريد الإلكتروني"
                                       type="email"
                                       placeholder="your@email.com"
                                       className="pr-8"
                                       disabled={isLoading}
                                       error={!!fieldState.error}
                                    />
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="phone"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <Phone className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                    <FloatingLabelInput
                                       {...field}
                                       label="رقم الهاتف"
                                       type="tel"
                                       placeholder="+963*********"
                                       className="pr-8"
                                       disabled={isLoading}
                                       error={!!fieldState.error}
                                    />
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Address & Birth Date Row */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="address"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <MapPin className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                    <FloatingLabelInput
                                       {...field}
                                       label="العنوان"
                                       type="text"
                                       placeholder="دمشق، سوريا"
                                       className="pr-8"
                                       disabled={isLoading}
                                       error={!!fieldState.error}
                                    />
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="birthDate"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <Calendar className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                    <FloatingLabelInput
                                       {...field}
                                       label="تاريخ الميلاد"
                                       type="date"
                                       className="pr-8"
                                       disabled={isLoading}
                                       error={!!fieldState.error}
                                    />
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     {/* Password Field */}
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <Lock className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                 <FloatingLabelInput
                                    {...field}
                                    label="كلمة المرور"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="pr-8 pl-10"
                                    disabled={isLoading}
                                    error={!!fieldState.error}
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowPassword(!showPassword)
                                    }
                                    className="absolute left-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-5 w-5" />
                                    ) : (
                                       <Eye className="h-5 w-5" />
                                    )}
                                 </button>
                              </div>
                              <FormMessage />

                              {/* Password Requirements */}
                              {password && (
                                 <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-2">
                                       متطلبات كلمة المرور:
                                    </p>
                                    <div className="space-y-1">
                                       {passwordRequirements.map(
                                          (req, index) => (
                                             <div
                                                key={index}
                                                className="flex items-center gap-2 text-xs"
                                             >
                                                {req.met ? (
                                                   <Check className="h-3 w-3 text-green-500" />
                                                ) : (
                                                   <X className="h-3 w-3 text-destructive" />
                                                )}
                                                <span
                                                   className={
                                                      req.met
                                                         ? 'text-green-600'
                                                         : 'text-muted-foreground'
                                                   }
                                                >
                                                   {req.label}
                                                </span>
                                             </div>
                                          )
                                       )}
                                    </div>
                                 </div>
                              )}
                           </FormItem>
                        )}
                     />

                     {/* Confirm Password Field */}
                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <Lock className="absolute right-0 top-3 h-5 w-5 text-muted-foreground z-10" />
                                 <FloatingLabelInput
                                    {...field}
                                    label="تأكيد كلمة المرور"
                                    type={
                                       showConfirmPassword ? 'text' : 'password'
                                    }
                                    placeholder="••••••••"
                                    className="pr-8 pl-10"
                                    disabled={isLoading}
                                    error={!!fieldState.error}
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowConfirmPassword(
                                          !showConfirmPassword
                                       )
                                    }
                                    className="absolute left-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                 >
                                    {showConfirmPassword ? (
                                       <EyeOff className="h-5 w-5" />
                                    ) : (
                                       <Eye className="h-5 w-5" />
                                    )}
                                 </button>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Terms Checkbox */}
                     <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <div className="space-y-1 leading-none mr-3">
                                 <FormLabel className="text-sm text-muted-foreground font-normal cursor-pointer">
                                    أوافق على{' '}
                                    <Link
                                       href="/terms"
                                       className="text-primary hover:underline"
                                    >
                                       شروط الاستخدام
                                    </Link>{' '}
                                    و{' '}
                                    <Link
                                       href="/privacy"
                                       className="text-primary hover:underline"
                                    >
                                       سياسة الخصوصية
                                    </Link>
                                 </FormLabel>
                                 <FormMessage />
                              </div>
                           </FormItem>
                        )}
                     />

                     {/* Submit Button */}
                     <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isLoading}
                     >
                        {isLoading ? (
                           <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جاري إنشاء الحساب...
                           </>
                        ) : (
                           'إنشاء حساب'
                        )}
                     </Button>
                  </form>
               </Form>

               {/* Divider */}
               <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-card px-2 text-muted-foreground">
                        أو سجل باستخدام
                     </span>
                  </div>
               </div>

               {/* Social Signup */}

               <Button
                  variant="outline"
                  className="h-11 w-full"
                  disabled={isLoading}
               >
                  <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24">
                     <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                     />
                     <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                     />
                     <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                     />
                     <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                     />
                  </svg>
                  Google
               </Button>

               {/* Login Link */}
               <p className="text-center text-sm text-muted-foreground mt-6">
                  لديك حساب بالفعل؟{' '}
                  <Link
                     href="/auth/login"
                     className="text-primary font-medium hover:underline"
                  >
                     تسجيل الدخول
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
