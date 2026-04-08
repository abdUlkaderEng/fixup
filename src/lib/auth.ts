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
      address?: string | null;
      birth_date?: string | null;
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
         address?: string | null;
         birth_date?: string | null;
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
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      address?: string | null;
      birth_date?: string | null;
      role?: string;
      email_verified_at?: string | null;
      created_at?: string;
      updated_at?: string;
      is_active?: number;
      profile_picture?: string | null;
   }
}

export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
                     address: response.data.user.address,
                     birth_date: response.data.user.birth_date,
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
      async jwt({ token, user, account, trigger, session }) {
         if (user) {
            token.id = user.id;
            token.accessToken = user.accessToken;
            token.name = user.name;
            token.email = user.email;
            token.image = user.image;
            token.phone = user.phone;
            token.address = user.address;
            token.birth_date = user.birth_date;
            token.role = user.role;
            token.email_verified_at = user.email_verified_at;
            token.created_at = user.created_at;
            token.updated_at = user.updated_at;
            token.is_active = user.is_active;
            token.profile_picture = user.profile_picture;
         }
         // Handle session update from client
         if (trigger === 'update' && session?.user) {
            token.name = session.user.name ?? token.name;
            token.phone = session.user.phone ?? token.phone;
            token.address = session.user.address ?? token.address;
            token.birth_date = session.user.birth_date ?? token.birth_date;
            token.email = session.user.email ?? token.email;
            token.role = session.user.role ?? token.role;
            token.profile_picture =
               session.user.profile_picture ?? token.profile_picture;
            token.email_verified_at =
               session.user.email_verified_at ?? token.email_verified_at;
            token.updated_at = session.user.updated_at ?? token.updated_at;
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
            session.user.name = token.name as string | null;
            session.user.email = token.email as string | null;
            session.user.image = token.image as string | null;
            session.user.phone = token.phone as string | null;
            session.user.address = token.address as string | null;
            session.user.birth_date = token.birth_date as string | null;
            session.user.role = token.role as string;
            session.user.email_verified_at = token.email_verified_at as
               | string
               | null;
            session.user.created_at = token.created_at as string;
            session.user.updated_at = token.updated_at as string;
            session.user.is_active = token.is_active as number;
            session.user.profile_picture = token.profile_picture as
               | string
               | null;
         }
         // Include all user data from authorize
         if (user) {
            session.user.phone = user.phone;
            session.user.address = user.address;
            session.user.birth_date = user.birth_date;
            session.user.role = user.role;
            session.user.email_verified_at = user.email_verified_at;
            session.user.created_at = user.created_at;
            session.user.updated_at = user.updated_at;
            session.user.is_active = user.is_active;
            session.user.profile_picture = user.profile_picture;
         }
         return session;
      },
      async signIn({ user, account, profile }) {
         // Only sync for Google OAuth
         if (account?.provider === 'google' && profile?.email) {
            try {
               // Call your backend to create/find user
               const response = await apiClient.post('/auth/google/callback', {
                  email: profile.email,
                  name: profile.name,
                  google_id: profile.sub,
                  profile_picture: profile.image,
               });

               // Update user with backend data
               if (response.data.user) {
                  user.id = String(response.data.user.id);
                  user.accessToken = response.data.token;
                  user.role = response.data.user.role;
                  user.phone = response.data.user.phone;
                  user.address = response.data.user.address;
                  user.birth_date = response.data.user.birth_date;
                  user.email_verified_at = response.data.user.email_verified_at;
                  user.created_at = response.data.user.created_at;
                  user.updated_at = response.data.user.updated_at;
                  user.is_active = response.data.user.is_active;
                  user.profile_picture = response.data.user.profile_picture;
               }
               return true;
            } catch (error) {
               console.error('Google signup error:', error);
               return false;
            }
         }
         return true;
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
