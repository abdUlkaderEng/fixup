'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface UseLogoutReturn {
   handleLogout: () => void;
   dialog: ReactNode;
}

/**
 * Hook to handle user logout with confirmation dialog
 * Single Responsibility: Logout confirmation and execution
 */
export function useLogout(): UseLogoutReturn {
   const router = useRouter();
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const handleConfirm = useCallback(async () => {
      setIsLoading(true);
      try {
         await signOut({ redirect: false });
         toast.success('تم تسجيل الخروج بنجاح');
         router.push('/');
      } catch {
         toast.error('حدث خطأ أثناء تسجيل الخروج');
         setIsLoading(false);
         setIsOpen(false);
      }
   }, [router]);

   const handleLogout = useCallback(() => setIsOpen(true), []);

   const dialog = useMemo(
      () => (
         <ConfirmDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            onConfirm={handleConfirm}
            isLoading={isLoading}
            title="تأكيد تسجيل الخروج"
            description="هل تريد تسجيل الخروج؟ سيتم إنهاء جلستك الحالية."
            confirmLabel="تأكيد"
            cancelLabel="إلغاء"
            variant="destructive"
         />
      ),
      [isOpen, handleConfirm, isLoading]
   );

   return { handleLogout, dialog };
}
