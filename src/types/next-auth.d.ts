import 'next-auth';
import 'next-auth/jwt';

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
