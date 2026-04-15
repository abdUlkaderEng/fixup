'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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
import { loginSchema, type LoginInput } from '../schemas';
import { useSession, signIn, getSession } from 'next-auth/react';

/**
 * Route constants for role-based navigation
 * Centralized routing configuration for maintainability
 */
const ROUTES = {
   ADMIN_DASHBOARD: '/admin/dashboard',
   HOME: '/',
   SERVER_ERROR: '/server-error',
} as const;

/**
 * User roles for authorization
 */
const USER_ROLES = {
   ADMIN: 'admin',
} as const;

/**
 * Determines the redirect path based on user role
 * @param role - The user's role from session
 * @returns The appropriate route path for the user
 */
function getRedirectPath(role?: string): string {
   return role === USER_ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME;
}

/**
 * Checks if error is a network-related error
 * @param error - The error to check
 * @returns True if network error, false otherwise
 */
function isNetworkError(error: unknown): boolean {
   if (!(error instanceof Error)) return false;

   const networkErrorIndicators = ['fetch', 'NetworkError', 'Failed to fetch'];
   return networkErrorIndicators.some((indicator) =>
      error.message.includes(indicator)
   );
}

export default function LoginPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: '',
         rememberMe: false,
      },
   });

   const router = useRouter();
   const { data: session, status } = useSession();

   /**
    * Effect: Redirect already authenticated users based on their role
    * This prevents authenticated users from accessing the login page
    */
   useEffect(() => {
      if (status === 'authenticated' && session?.user) {
         const redirectPath = getRedirectPath(session.user.role);
         router.push(redirectPath);
      }
   }, [status, session, router]);
   // if (status === 'authenticated' && session?.user) {
   //    router.push('/');
   // }

   /**
    * Handles form submission for credentials sign-in
    * Authenticates user and redirects based on their role
    * @param data - Login form data (email, password, rememberMe)
    */
   const handleCredentialsSignIn = async (data: LoginInput): Promise<void> => {
      const signInResult = await signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: false,
      });

      if (signInResult?.error) {
         toast.error('فشل تسجيل الدخول', {
            description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
         });
         return;
      }

      // Fetch fresh session to get user role after sign-in
      const freshSession = await getSession();
      const userRole = freshSession?.user?.role;
      const redirectPath = getRedirectPath(userRole);

      toast.success(`أهلاً بك ! ${freshSession?.user?.name || ''}`, {
         description: 'تم تسجيل الدخول بنجاح',
      });

      router.push(redirectPath);
      router.refresh();
   };

   /**
    * Handles errors during sign-in process
    * @param error - The error that occurred
    */
   const handleSignInError = (error: unknown): void => {
      if (isNetworkError(error)) {
         router.push(ROUTES.SERVER_ERROR);
         return;
      }

      const errorMessage =
         error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول';

      toast.error('فشل تسجيل الدخول', {
         description: errorMessage,
      });
   };

   /**
    * Main form submission handler
    * Orchestrates the sign-in flow with loading states and error handling
    * @param data - Login form data
    */
   const onSubmit = async (data: LoginInput): Promise<void> => {
      setIsLoading(true);

      try {
         await handleCredentialsSignIn(data);
      } catch (error) {
         handleSignInError(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="w-full max-w-md">
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
                     <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">تسجيل الدخول</h1>
                  <p className="text-muted-foreground text-sm">
                     أهلاً بك مجدداً! سجل دخولك للمتابعة
                  </p>
               </div>

               {/* Form */}
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     {/* Email Field */}
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
                                    placeholder="أدخل كلمة المرور"
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
                           </FormItem>
                        )}
                     />

                     {/* Remember Me & Forgot Password */}
                     <div className="flex items-center justify-between">
                        <FormField
                           control={form.control}
                           name="rememberMe"
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
                                       تذكرني
                                    </FormLabel>
                                 </div>
                              </FormItem>
                           )}
                        />
                        <Link
                           href="/auth/forgot-password"
                           className="text-sm text-primary hover:underline"
                        >
                           نسيت كلمة المرور؟
                        </Link>
                     </div>

                     {/* Submit Button */}
                     <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isLoading}
                     >
                        {isLoading ? (
                           <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جاري تسجيل الدخول...
                           </>
                        ) : (
                           'تسجيل الدخول'
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
                        أو سجل الدخول باستخدام
                     </span>
                  </div>
               </div>

               {/* Social Login */}

               <Button
                  variant="outline"
                  className="h-11 w-full"
                  disabled={isLoading}
                  onClick={() => signIn('google', { callbackUrl: ROUTES.HOME })}
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

               {/* Sign Up Link */}
               <p className="text-center text-sm text-muted-foreground mt-6">
                  ليس لديك حساب؟{' '}
                  <Link
                     href="/auth/signup"
                     className="text-primary font-medium hover:underline"
                  >
                     إنشاء حساب جديد
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
