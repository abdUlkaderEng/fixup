import type { CallbacksOptions } from 'next-auth';
import { apiClient } from '@/lib/axios';
import {
   syncUserToToken,
   syncTokenToSession,
   updateTokenFromSession,
   mapGoogleProfileToAuthUser,
} from './mappers';

import type { AuthResponse } from '@/types/auth';

interface GoogleProfile {
   email?: string | null;
   name?: string | null;
   sub?: string;
   image?: string | null;
}

const GOOGLE_PROVIDER = 'google';

export const jwtCallback: CallbacksOptions['jwt'] = async ({
   token,
   user,
   account,
   trigger,
   session,
}) => {
   if (user) {
      syncUserToToken(token as Record<string, unknown>, user);
   }

   if (trigger === 'update' && session?.user) {
      updateTokenFromSession(
         token as Record<string, unknown>,
         session.user as Record<string, unknown>
      );
   }

   if (account) {
      (token as Record<string, unknown>).provider = account.provider;
   }

   return token;
};

export const sessionCallback: CallbacksOptions['session'] = async ({
   session,
   token,
}) => {
   if (token) {
      syncTokenToSession(
         session.user as Record<string, unknown>,
         token as Record<string, unknown>
      );
   }

   return session;
};

export const signInCallback: CallbacksOptions['signIn'] = async ({
   user,
   account,
   profile,
}) => {
   if (account?.provider !== GOOGLE_PROVIDER) {
      return true;
   }

   const googleProfile = profile as GoogleProfile | undefined;
   if (!googleProfile?.email) {
      return true;
   }

   try {
      const { data } = await apiClient.post<AuthResponse>(
         '/auth/google/callback',
         {
            email: googleProfile.email,
            name: googleProfile.name,
            google_id: googleProfile.sub,
            profile_image: googleProfile.image,
         }
      );

      if (data.user) {
         const updatedUser = mapGoogleProfileToAuthUser(
            googleProfile,
            data.user,
            data.token
         );
         Object.assign(user, updatedUser);
      }

      return true;
   } catch (error) {
      console.error('Google signup error:', error);
      return false;
   }
};
