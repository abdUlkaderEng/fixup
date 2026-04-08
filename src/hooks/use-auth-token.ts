'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setAuthToken } from '@/lib/axios';

/**
 * Hook to sync Bearer token from NextAuth session to axios client
 * Single Responsibility: Authentication token synchronization
 */
export function useAuthToken(): void {
   const { data: session } = useSession();

   useEffect(() => {
      const token = session?.user?.accessToken;
      setAuthToken(token || null);
   }, [session]);
}

export default useAuthToken;
