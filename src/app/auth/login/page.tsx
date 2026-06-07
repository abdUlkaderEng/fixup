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
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginInput } from '../schemas';
import { useSession, signIn, getSession } from 'next-auth/react';

/**
 * Route constants for role-based navigation
 * Centralized routing configuration for maintainability
 */
const ROUTES = {
   ADMIN_DASHBOARD: '/admin/dashboard',
   WORKER_DASHBOARD: '/worker/dashboard',
   HOME: '/',
   SERVER_ERROR: '/server-error',
} as const;

/**
 * User roles for authorization
 */
const USER_ROLES = {
   ADMIN: 'admin',
   WORKER: 'worker',
} as const;

/**
 * Determines the redirect path based on user role
 * @param role - The user's role from session
 * @returns The appropriate route path for the user
 */
function getRedirectPath(role?: string): string {
   if (role === USER_ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
   if (role === USER_ROLES.WORKER) return ROUTES.WORKER_DASHBOARD;
   return ROUTES.HOME;
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

      // Hard navigation (not router.push) so the destination loads with the
      // session cookie fully in place. A client-side push here can leave
      // useSession() stuck on "loading" until the next window-focus refetch,
      // which left protected pages spinning right after login.
      window.location.assign(redirectPath);
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
