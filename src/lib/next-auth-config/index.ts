import type { NextAuthOptions } from 'next-auth';
import { googleProvider, credentialsProvider } from './providers';
import { jwtCallback, sessionCallback, signInCallback } from './callbacks';

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
   providers: [googleProvider, credentialsProvider],
   callbacks: {
      jwt: jwtCallback,
      session: sessionCallback,
      signIn: signInCallback,
   },
   pages: {
      signIn: '/auth/login',
      error: '/auth/error',
   },
   session: {
      strategy: 'jwt',
      maxAge: THIRTY_DAYS_IN_SECONDS,
   },
   secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
