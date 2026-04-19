import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
   interface User {
      id: string;
      accessToken?: string;
      phone_number?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      detailed_address?: string | null;
      area_address_id?: number | null;
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
         phone_number?: string | null;
         latitude?: number | null;
         longitude?: number | null;
         detailed_address?: string | null;
         area_address_id?: number | null;
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
      phone_number?: string | null;
      latitude?: number | null;
      longitude?: number | null;
      detailed_address?: string | null;
      area_address_id?: number | null;
      birth_date?: string | null;
      role?: string;
      email_verified_at?: string | null;
      created_at?: string;
      updated_at?: string;
      is_active?: number;
      profile_picture?: string | null;
   }
}
