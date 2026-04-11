import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/axios';
import { mapBackendUserToAuthUser } from './mappers';

import type { AuthResponse } from '@/types/auth';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
   throw new Error('Missing Google OAuth environment variables');
}

export const googleProvider = GoogleProvider({
   clientId: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const credentialsProvider = CredentialsProvider({
   name: 'credentials',
   credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
   },
   async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
         return null;
      }

      try {
         const { data } = await apiClient.post<AuthResponse>('/login', {
            email: credentials.email,
            password: credentials.password,
         });

         if (!data.user) {
            return null;
         }

         return mapBackendUserToAuthUser(data.user, data.token);
      } catch {
         return null;
      }
   },
});
