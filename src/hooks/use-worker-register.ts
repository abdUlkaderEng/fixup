'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { authApi } from '@/api/auth';
import { setAuthToken } from '@/lib/axios';
import {
   clearWorkerSignupDraft,
   type WorkerSignupDraft,
} from '@/app/auth/signup-flow';
import type { WorkerInfoInput } from '@/app/auth/schemas';
import type { RegisterWorkerRequest } from '@/types/auth';

interface UseWorkerRegisterReturn {
   isSubmitting: boolean;
   onSubmit: (workerData: WorkerInfoInput) => Promise<void>;
}

/**
 * Hook to handle worker registration after signup
 * Flow: login → get JWT → register worker → cleanup → redirect
 */
export function useWorkerRegister(
   signupDraft: WorkerSignupDraft | null
): UseWorkerRegisterReturn {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();

   const onSubmit = useCallback(
      async (workerData: WorkerInfoInput) => {
         if (!signupDraft) {
            toast.error('لم يتم العثور على بيانات التسجيل');
            router.push('/auth/signup');
            return;
         }

         setIsSubmitting(true);

         try {
            // Step 1: Login to get JWT token
            const loginResponse = await authApi.login({
               email: signupDraft.email,
               password: signupDraft.password,
            });

            // Step 2: Set token for subsequent requests
            setAuthToken(loginResponse.token);

            // Step 3: Prepare worker registration data
            const workerRequestData: RegisterWorkerRequest = {
               career_id: workerData.career_id,
               about: workerData.about,
               years_experience: workerData.years_experience,
               services: workerData.services,
               images: workerData.images,
            };

            // Step 4: Register worker (token is automatically attached by interceptor)
            await authApi.registerWorker(workerRequestData);

            // Step 5: Cleanup - clear signup draft
            clearWorkerSignupDraft();

            // Step 6: Logout user (they need to login again)
            await signOut({ redirect: false });

            // Step 7: Show success and redirect
            toast.success('تم إنشاء حساب العامل بنجاح!', {
               description: 'Login to your account',
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
                  : 'حدث خطأ أثناء إنشاء حساب العامل';

            toast.error('فشل إنشاء حساب العامل', {
               description: message,
            });
         } finally {
            setIsSubmitting(false);
         }
      },
      [signupDraft, router]
   );

   return {
      isSubmitting,
      onSubmit,
   };
}

export default useWorkerRegister;
