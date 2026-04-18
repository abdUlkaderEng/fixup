'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setAuthToken } from '@/lib/axios';

/**
 * Hook to sync Bearer token from NextAuth session to axios client
 * Single Responsibility: Authentication token synchronization
 */
export function useAuthToken(): void {
   const { data: session, status } = useSession();

   useEffect(() => {
      const token = session?.user?.accessToken;
      console.log(
         '[useAuthToken] Session status:',
         status,
         'Token exists:',
         !!token
      );
      setAuthToken(token || null);
   }, [session, status]);
}

export default useAuthToken;
