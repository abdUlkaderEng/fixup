import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '@/lib/axios';

declare module 'next-auth' {
   interface User {
      id: string;
      accessToken?: string;
      phone?: string | null;
      role?: string;
      email_verified_at?: string | null;
      created_at?: string;
      updated_at?: string;
      is_active?: number;
      profile_picture?: string | null;
   }
   interface Session {
      user: {
         id: string;
         name?: string | null;
         email?: string | null;
         image?: string | null;
         accessToken?: string;
         provider?: string;
         phone?: string | null;
         role?: string;
         email_verified_at?: string | null;
         created_at?: string;
         updated_at?: string;
         is_active?: number;
         profile_picture?: string | null;
      };
   }
}

declare module 'next-auth/jwt' {
   interface JWT {
      id?: string;
      accessToken?: string;
      provider?: string;
   }
}

export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      FacebookProvider({
         clientId: process.env.FACEBOOK_CLIENT_ID!,
         clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      }),
      CredentialsProvider({
         name: 'credentials',
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
            try {
               const response = await apiClient.post('/login', {
                  email: credentials?.email,
                  password: credentials?.password,
               });

               if (response.data.user) {
                  return {
                     id: String(response.data.user.id),
                     name: response.data.user.name,
                     email: response.data.user.email,
                     image: response.data.user.profile_picture,
                     accessToken: response.data.token,
                     phone: response.data.user.phone,
                     role: response.data.user.role,
                     email_verified_at: response.data.user.email_verified_at,
                     created_at: response.data.user.created_at,
                     updated_at: response.data.user.updated_at,
                     is_active: response.data.user.is_active,
                     profile_picture: response.data.user.profile_picture,
                  };
               }
               return null;
            } catch {
               return null;
            }
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user, account }) {
         if (user) {
            token.id = user.id;
            token.accessToken = user.accessToken;
         }
         if (account) {
            token.provider = account.provider;
         }
         return token;
      },
      async session({ session, token, user }) {
         if (token) {
            session.user.id = token.id as string;
            session.user.accessToken = token.accessToken as string;
            session.user.provider = token.provider as string;
         }
         // Include all user data from authorize
         if (user) {
            session.user.phone = user.phone;
            session.user.role = user.role;
            session.user.email_verified_at = user.email_verified_at;
            session.user.created_at = user.created_at;
            session.user.updated_at = user.updated_at;
            session.user.is_active = user.is_active;
            session.user.profile_picture = user.profile_picture;
         }
         return session;
      },
   },
   pages: {
      signIn: '/auth/login',
      error: '/auth/error',
   },
   session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
   },
   secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
