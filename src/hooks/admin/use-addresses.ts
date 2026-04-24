'use client';

import { useCallback } from 'react';
import { addressesApi } from '@/api/admin';
import { useFetch, useMutation, generateRequestKey } from './shared';
import type { Address } from '@/types/admin/addresses';

export interface UseAddressesReturn {
   addresses: Address[];
   isLoading: boolean;
   isAdding: boolean;
   isDeleting: boolean;
   error: Error | null;
   refetch: () => void;
   addAddress: (name: string) => Promise<void>;
   deleteAddress: (id: number) => Promise<void>;
}

export interface UseAddressesOptions {
   autoFetch?: boolean;
}

/**
 * Hook for addresses with fetch and mutations combined
 */
export function useAddresses(
   options: UseAddressesOptions = {}
): UseAddressesReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(async () => {
      const response = await addressesApi.getAll();
      return response.data ?? [];
   }, []);

   const { data, isLoading, error, refetch, setData } = useFetch<Address[]>(
      fetcher,
      generateRequestKey('addresses-list'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب العناوين',
      }
   );

   const addMutation = useMutation(
      async (areaName: string) => {
         const trimmedName = areaName.trim();
         if (!trimmedName) {
            throw new Error('اسم المنطقة مطلوب');
         }
         const response = await addressesApi.create({ area_name: trimmedName });
         return response;
      },
      {
         successMessage: 'تم إضافة المنطقة بنجاح',
         errorMessage: 'حدث خطأ أثناء إضافة المنطقة',
         onSuccess: (result) => {
            if (result) {
               setData((prev: Address[] | null) =>
                  prev ? [result, ...prev] : [result]
               );
            }
            // Re-fetch to ensure consistency
            refetch();
         },
      }
   );

   const deleteMutation = useMutation(
      async (addressId: number) => {
         await addressesApi.delete(addressId);
         return addressId;
      },
      {
         successMessage: 'تم حذف العنوان بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف العنوان',
         onSuccess: (_, addressId) => {
            setData((prev: Address[] | null) =>
               prev ? prev.filter((addr: Address) => addr.id !== addressId) : []
            );
         },
      }
   );

   const addAddress = useCallback(
      async (name: string) => {
         await addMutation.mutateAsync(name);
      },
      [addMutation]
   );

   const deleteAddress = useCallback(
      async (id: number) => {
         await deleteMutation.mutateAsync(id);
      },
      [deleteMutation]
   );

   return {
      addresses: data ?? [],
      isLoading,
      isAdding: addMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      error,
      refetch,
      addAddress,
      deleteAddress,
   };
}

export default useAddresses;
