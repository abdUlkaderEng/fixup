'use client';

import { useCallback } from 'react';
import { ProfileView, ProfileModeProvider } from '@/components/profile';

export default function CustomerProfilePage() {
   const handleConvertToWorker = useCallback(() => {
      // TODO: Implement account conversion logic
      console.log('Convert to worker account');
   }, []);

   return (
      <ProfileModeProvider mode="customer">
         <ProfileView
            backLink="/customer/dashboard"
            backLabel="العودة للوحة التحكم"
            roleLabel="عميل"
            onConvertToWorker={handleConvertToWorker}
         />
      </ProfileModeProvider>
   );
}
