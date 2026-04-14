'use client';

import { ProfileView, ProfileModeProvider } from '@/components/profile';

export default function WorkerProfilePage() {
   return (
      <ProfileModeProvider mode="worker">
         <ProfileView
            backLink="/worker/dashboard"
            backLabel="العودة للوحة التحكم"
            roleLabel="فني"
         />
      </ProfileModeProvider>
   );
}
