'use client';

import { useCallback } from 'react';
import { topupApi } from '@/api/admin';
import { useMutation } from '../shared';
import type {
   WalletTopupRequest,
   WalletTransaction,
} from '@/types/admin/wallet';

export interface UseWalletTopupReturn {
   isTopupLoading: boolean;
   error: Error | null;
   topup: (
      userId: number,
      data: WalletTopupRequest
   ) => Promise<WalletTransaction | null>;
}

export interface UseWalletTopupOptions {
   onSuccess?: (transaction: WalletTransaction) => void;
}

/**
 * Wallet top-up mutation hook.
 *
 * Validates inputs locally before the request so we don't waste a round trip
 * (and so error messages are in Arabic, not raw server text).
 */
export function useWalletTopup(
   options: UseWalletTopupOptions = {}
): UseWalletTopupReturn {
   const { onSuccess } = options;

   const mutation = useMutation(
      async (variables: { userId: number; data: WalletTopupRequest }) => {
         const { userId, data } = variables;

         if (!userId) {
            throw new Error('يجب اختيار العامل');
         }
         if (!Number.isFinite(data.amount) || data.amount <= 0) {
            throw new Error('المبلغ يجب أن يكون أكبر من صفر');
         }
         if (!data.note.trim()) {
            throw new Error('الملاحظة مطلوبة');
         }

         const response = await topupApi.create(userId, {
            amount: data.amount,
            note: data.note.trim(),
         });
         return response.data;
      },
      {
         successMessage: 'تم شحن المحفظة بنجاح',
         errorMessage: 'حدث خطأ أثناء شحن المحفظة',
         onSuccess: (transaction) => {
            if (transaction) onSuccess?.(transaction);
         },
      }
   );

   const topup = useCallback(
      async (userId: number, data: WalletTopupRequest) => {
         return await mutation.mutate({ userId, data });
      },
      [mutation]
   );

   return {
      isTopupLoading: mutation.isLoading,
      error: mutation.error,
      topup,
   };
}

export default useWalletTopup;
