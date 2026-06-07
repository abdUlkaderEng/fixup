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
   BriefcaseBusiness,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { clearWorkerSignupDraft, saveWorkerSignupDraft } from '../signup-flow';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { MapPicker } from '@/components/map/map-picker';
import { usePublicAreas } from '@/hooks/public/use-public-areas';
import AreaSelect from '@/components/form-pickers/area-select';

type SignupFormValues = z.input<typeof signupSchema>;

export default function SignupPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<SignupFormValues, unknown, SignupInput>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         fullName: '',
         email: '',
         phone_number: '',
         address: '',
         area_address_id: 0,
         latitude: 0,
         longitude: 0,
         birthDate: '',
         password: '',
         confirmPassword: '',
         registerAsWorker: false,
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
            phone_number: data.phone_number,
            latitude: data.latitude,
            longitude: data.longitude,
            detailed_address: data.address,
            area_address_id: data.area_address_id,
            birth_date: data.birthDate,
            password: data.password,
            password_confirmation: data.confirmPassword,
         });

         if (data.registerAsWorker) {
            saveWorkerSignupDraft({
               fullName: data.fullName,
               email: data.email,
               phone_number: data.phone_number,
               latitude: data.latitude,
               longitude: data.longitude,
               address: data.address,
               area_address_id: data.area_address_id,
               birthDate: data.birthDate,
               password: data.password,
            });

            toast.success('تم إنشاء الحساب بنجاح!', {
               description: 'أكمل بيانات العامل في الخطوة التالية',
            });
            router.push('/auth/worker-info');
            return;
         }

         clearWorkerSignupDraft();

         toast.success('تم إنشاء الحساب بنجاح!', {
            description: 'بإمكانك الآن تسجيل الدخول',
         });
         router.push('/auth/login');
      } catch (error) {
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
            <Link
               href="/"
               className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة للرئيسية</span>
            </Link>

            <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
               <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                     <User className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold">إنشاء حساب جديد</h1>
                  <p className="text-sm text-muted-foreground">
                     أنشئ حسابك الآن واكتشف خدماتنا المميزة
                  </p>
               </div>

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-5"
                  >
                     <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <User className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
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

                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                           control={form.control}
                           name="email"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <Mail className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
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
                           name="phone_number"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <Phone className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
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

                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                           control={form.control}
                           name="address"
                           render={({ field, fieldState }) => (
                              <FormItem className="space-y-0">
                                 <div className="relative">
                                    <MapPin className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
                                    <FloatingLabelInput
                                       {...field}
                                       value={field.value ?? ''}
                                       label="العنوان التفصيلي"
                                       type="text"
                                       placeholder="دمشق، المزة، بناء رقم ١"
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
                           name="area_address_id"
                           render={({ field }) => (
                              <FormItem className="space-y-0">
                                 <AreaSelect
                                    value={field.value ?? null}
                                    onChange={(v) => field.onChange(v ?? 0)}
                                    disabled={isLoading}
                                 />
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <MapPicker
                        mapTilerKey={process.env.NEXT_PUBLIC_MAPTILER_KEY!}
                        onLocationSelect={(lng, lat) => {
                           form.setValue('latitude', lat);
                           form.setValue('longitude', lng);
                        }}
                     />

                     <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <Calendar className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
                                 <FloatingLabelInput
                                    {...field}
                                    value={field.value ?? ''}
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
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <Lock className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
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
                                    className="absolute top-3 left-0 text-muted-foreground transition-colors hover:text-foreground"
                                 >
                                    {showPassword ? (
                                       <EyeOff className="h-5 w-5" />
                                    ) : (
                                       <Eye className="h-5 w-5" />
                                    )}
                                 </button>
                              </div>
                              <FormMessage />

                              {password && (
                                 <div className="mt-3 rounded-lg bg-muted p-3">
                                    <p className="mb-2 text-xs text-muted-foreground">
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

                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                           <FormItem className="space-y-0">
                              <div className="relative">
                                 <Lock className="absolute top-3 right-0 z-10 h-5 w-5 text-muted-foreground" />
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
                                    className="absolute top-3 left-0 text-muted-foreground transition-colors hover:text-foreground"
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

                     <FormField
                        control={form.control}
                        name="registerAsWorker"
                        render={({ field }) => (
                           <FormItem className="rounded-xl border border-border/70 bg-muted/40 p-4">
                              <div className="flex items-start gap-3">
                                 <FormControl>
                                    <Checkbox
                                       checked={field.value}
                                       onCheckedChange={(checked) =>
                                          field.onChange(Boolean(checked))
                                       }
                                       disabled={isLoading}
                                    />
                                 </FormControl>
                                 <div className="space-y-1">
                                    <FormLabel className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                                       <BriefcaseBusiness className="h-4 w-4 text-primary" />
                                       <span>التسجيل كعامل</span>
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                       عند التفعيل سننقلك لخطوة إضافية لاستكمال
                                       بيانات العمل والخدمات.
                                    </p>
                                 </div>
                              </div>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="termsAccepted"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                              <FormControl>
                                 <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                       field.onChange(Boolean(checked))
                                    }
                                    disabled={isLoading}
                                 />
                              </FormControl>
                              <div className="mr-3 space-y-1 leading-none">
                                 <FormLabel className="cursor-pointer text-sm font-normal text-muted-foreground">
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

                     <Button
                        type="submit"
                        className="h-11 w-full"
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

               <p className="mt-6 text-center text-sm text-muted-foreground">
                  لديك حساب بالفعل؟{' '}
                  <Link
                     href="/auth/login"
                     className="font-medium text-primary hover:underline"
                  >
                     تسجيل الدخول
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
