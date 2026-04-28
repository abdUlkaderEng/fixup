'use client';

import { ProfileView, ProfileModeProvider } from '@/components/profile';

export default function CustomerProfilePage() {
   return (
      <ProfileModeProvider mode="customer">
         <ProfileView
            backLink="/customer/dashboard"
            backLabel="العودة للوحة التحكم"
            roleLabel="عميل"
         />
      </ProfileModeProvider>
   );
}
