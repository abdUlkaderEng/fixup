import React from 'react';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
const ClearCashComponents = () => {
   const router = useRouter();
   const handleClearCache = async () => {
      try {
         // 1. Clear localStorage (zustand auth-storage)
         localStorage.removeItem('auth-storage');

         // 2. Clear sessionStorage if any
         sessionStorage.clear();

         // 3. Sign out from NextAuth
         await signOut({ redirect: false });

         toast.success('تم مسح ذاكرة التخزين المؤقت بنجاح');
         router.push('/auth/login');
      } catch {
         toast.error('حدث خطأ أثناء مسح ذاكرة التخزين');
      }
   };
   return (
      <Button
         variant="outline"
         onClick={handleClearCache}
         className="w-full text-muted-foreground hover:text-destructive border-dashed"
      >
         <Trash2 className="h-4 w-4 ml-2" />
         مسح ذاكرة التخزين المؤقت والجلسة
      </Button>
   );
};

export default ClearCashComponents;
