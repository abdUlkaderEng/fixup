'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type { Address } from '@/types/address';

interface UseAddressesReturn {
   addresses: Address[];
   isLoading: boolean;
   isAdding: boolean;
   isDeleting: boolean;
   error: string | null;
   fetch: () => void;
   addAddress: (name: string) => Promise<void>;
   deleteAddress: (id: number) => Promise<void>;
}

export function useAddresses(): UseAddressesReturn {
   const { status: sessionStatus } = useSession();
   const isFetchingRef = useRef(false);
   const isAddingRef = useRef(false);
   const isDeletingRef = useRef(false);
   const mountedRef = useRef(true);
   const attemptedFetchRef = useRef(false);

   const [addresses, setAddresses] = useState<Address[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isAdding, setIsAdding] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchAddresses = useCallback(async () => {
      if (isFetchingRef.current) {
         console.log(
            '[useAddresses] Already fetching, skipping duplicate request'
         );
         return;
      }

      if (sessionStatus !== 'authenticated') {
         console.log('[useAddresses] Not authenticated, skipping fetch');
         return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
         console.log('[useAddresses] Fetching addresses...');
         const response = await adminApi.getAddresses();

         if (!mountedRef.current) return;

         // API returns: { data: [...], links: {...}, meta: {...} }
         const addressList = Array.isArray(response.data) ? response.data : [];

         setAddresses(addressList);
         console.log('[useAddresses] Fetched', addressList.length, 'addresses');
      } catch (err) {
         const message =
            err instanceof Error ? err.message : 'حدث خطأ أثناء جلب العناوين';
         console.error('[useAddresses] Request failed:', message);

         if (mountedRef.current) {
            setError(message);
            toast.error('فشل تحميل العناوين', {
               description: message,
            });
         }
      } finally {
         if (mountedRef.current) {
            setIsLoading(false);
         }
         isFetchingRef.current = false;
      }
   }, [sessionStatus]);

   const addAddress = useCallback(
      async (areaName: string) => {
         if (isAddingRef.current) {
            console.log(
               '[useAddresses] Already adding, skipping duplicate request'
            );
            return;
         }

         if (sessionStatus !== 'authenticated') {
            toast.error('غير مصرح', {
               description: 'يجب تسجيل الدخول أولاً',
            });
            return;
         }

         const trimmedName = areaName.trim();
         if (!trimmedName) {
            toast.error('اسم المنطقة مطلوب');
            return;
         }

         isAddingRef.current = true;
         setIsAdding(true);

         try {
            console.log('[useAddresses] Adding address:', trimmedName);
            // API expects: { area_name: string }
            // API returns: { id, area_name, created_at }
            const newAddress = await adminApi.createAddress({
               area_name: trimmedName,
            });

            console.log('[useAddresses] Added address:', newAddress);

            // Ensure we have a valid address object
            if (newAddress && newAddress.id) {
               // Update state immediately for UI responsiveness
               setAddresses((prev) => [newAddress, ...prev]);
               console.log('[useAddresses] State updated with new address');
            }

            // Re-fetch to ensure consistency with server
            console.log('[useAddresses] Re-fetching addresses...');
            await fetchAddresses();

            if (mountedRef.current) {
               toast.success('تم إضافة المنطقة بنجاح');
            }
         } catch (err) {
            const message =
               err instanceof Error
                  ? err.message
                  : 'حدث خطأ أثناء إضافة المنطقة';
            console.error('[useAddresses] Add failed:', message);

            if (mountedRef.current) {
               toast.error('فشل إضافة المنطقة', {
                  description: message,
               });
            }
            throw err;
         } finally {
            if (mountedRef.current) {
               setIsAdding(false);
            }
            isAddingRef.current = false;
         }
      },
      [sessionStatus, fetchAddresses]
   );

   const deleteAddress = useCallback(
      async (id: number) => {
         if (isDeletingRef.current) {
            console.log(
               '[useAddresses] Already deleting, skipping duplicate request'
            );
            return;
         }

         if (sessionStatus !== 'authenticated') {
            toast.error('غير مصرح', {
               description: 'يجب تسجيل الدخول أولاً',
            });
            return;
         }

         isDeletingRef.current = true;
         setIsDeleting(true);

         try {
            console.log('[useAddresses] Deleting address:', id);
            await adminApi.deleteAddress(id);

            if (!mountedRef.current) return;

            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            toast.success('تم حذف العنوان بنجاح');
         } catch (err) {
            const message =
               err instanceof Error ? err.message : 'حدث خطأ أثناء حذف العنوان';
            console.error('[useAddresses] Delete failed:', message);

            if (mountedRef.current) {
               toast.error('فشل حذف العنوان', {
                  description: message,
               });
            }
            throw err;
         } finally {
            if (mountedRef.current) {
               setIsDeleting(false);
            }
            isDeletingRef.current = false;
         }
      },
      [sessionStatus]
   );

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   // Manual fetch function
   const fetch = useCallback(() => {
      if (sessionStatus !== 'authenticated') {
         toast.error('غير مصرح', {
            description: 'يجب تسجيل الدخول أولاً',
         });
         return;
      }
      attemptedFetchRef.current = true;
      fetchAddresses();
   }, [sessionStatus, fetchAddresses]);

   // Auto-fetch on mount when authenticated
   useEffect(() => {
      if (!attemptedFetchRef.current && sessionStatus === 'authenticated') {
         attemptedFetchRef.current = true;
         fetchAddresses();
      }
   }, [sessionStatus, fetchAddresses]);

   return {
      addresses,
      isLoading,
      isAdding,
      isDeleting,
      error,
      fetch,
      addAddress,
      deleteAddress,
   };
}

export default useAddresses;
