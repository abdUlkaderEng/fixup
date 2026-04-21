'use client';

import { useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// ============================================
// Types
// ============================================

export interface UseMutationOptions<TData, TVariables> {
   onSuccess?: (data: TData, variables: TVariables) => void;
   onError?: (error: Error, variables: TVariables) => void;
   successMessage?: string;
   errorMessage?: string;
   skipAuthCheck?: boolean;
}

export interface UseMutationReturn<TData, TVariables> {
   mutate: (variables: TVariables) => Promise<TData | null>;
   mutateAsync: (variables: TVariables) => Promise<TData>;
   isLoading: boolean;
   error: Error | null;
   reset: () => void;
}

// ============================================
// Generic Mutation Hook
// ============================================

export function useMutation<TData, TVariables = void>(
   mutationFn: (variables: TVariables) => Promise<TData>,
   options: UseMutationOptions<TData, TVariables> = {}
): UseMutationReturn<TData, TVariables> {
   const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'حدث خطأ أثناء تنفيذ العملية',
      skipAuthCheck = false,
   } = options;

   const { status: sessionStatus } = useSession();
   const isMutatingRef = useRef(false);

   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const reset = useCallback(() => {
      setError(null);
      setIsLoading(false);
      isMutatingRef.current = false;
   }, []);

   const executeMutation = useCallback(
      async (
         variables: TVariables,
         throwOnError = false
      ): Promise<TData | null> => {
         if (isMutatingRef.current) {
            return null;
         }

         if (!skipAuthCheck && sessionStatus !== 'authenticated') {
            toast.error('غير مصرح', { description: 'يجب تسجيل الدخول أولاً' });
            return null;
         }

         isMutatingRef.current = true;
         setIsLoading(true);
         setError(null);

         try {
            const result = await mutationFn(variables);

            if (successMessage) {
               toast.success(successMessage);
            }

            onSuccess?.(result, variables);
            return result;
         } catch (err) {
            const mutationError =
               err instanceof Error ? err : new Error(String(err));
            setError(mutationError);

            if (errorMessage) {
               toast.error(errorMessage, {
                  description: mutationError.message,
               });
            }

            onError?.(mutationError, variables);

            if (throwOnError) {
               throw mutationError;
            }

            return null;
         } finally {
            setIsLoading(false);
            isMutatingRef.current = false;
         }
      },
      [
         mutationFn,
         sessionStatus,
         skipAuthCheck,
         successMessage,
         errorMessage,
         onSuccess,
         onError,
      ]
   );

   const mutate = useCallback(
      (variables: TVariables) => executeMutation(variables, false),
      [executeMutation]
   );

   const mutateAsync = useCallback(
      async (variables: TVariables): Promise<TData> => {
         const result = await executeMutation(variables, true);
         if (result === null) {
            throw new Error('Mutation returned null');
         }
         return result;
      },
      [executeMutation]
   );

   return {
      mutate,
      mutateAsync,
      isLoading,
      error,
      reset,
   };
}

export default useMutation;
