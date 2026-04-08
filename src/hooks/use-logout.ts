'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

/**
 * Hook to handle user logout with confirmation
 * Single Responsibility: Logout confirmation and execution
 */
export function useLogout(): () => void {
   const router = useRouter();

   const handleLogout = useCallback(() => {
      toast.warning('هل تريد تسجيل الخروج؟', {
         description: 'سيتم إنهاء جلستك الحالية',
         action: {
            label: 'تأكيد',
            onClick: async () => {
               try {
                  await signOut({ redirect: false });
                  toast.success('تم تسجيل الخروج بنجاح');
                  router.push('/');
               } catch {
                  toast.error('حدث خطأ أثناء تسجيل الخروج');
               }
            },
         },
         cancel: {
            label: 'إلغاء',
            onClick: () => {},
         },
      });
   }, [router]);

   return handleLogout;
}

export default useLogout;
