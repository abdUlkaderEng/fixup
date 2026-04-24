import 'next-auth';
import 'next-auth/jwt';
import type { Worker } from '@/types/entities/worker';
import type { UserAddress } from '@/types/entities/address';

// ============================================
// Common User Profile Fields (DRY pattern)
// ============================================

type UserProfileFields = {
   phone_number?: string | null;
   // latitude/longitude come from backend as strings
   latitude?: string | null;
   longitude?: string | null;
   detailed_address?: string | null;
   area_address_id?: number | null;
   birth_date?: string | null;
   role?: string;
   email_verified_at?: string | null;
   created_at?: string;
   updated_at?: string;
   is_active?: number;
   profile_picture?: string | null;
   // Full nested address object (includes area_address.area_name)
   address?: UserAddress | null;
   worker?: Worker | null;
};

// ============================================
// Next-Auth Module Extensions
// ============================================

declare module 'next-auth' {
   interface User extends UserProfileFields {
      id: string;
      accessToken?: string;
   }

   interface Session {
      user: UserProfileFields & {
         id: string;
         name?: string | null;
         email?: string | null;
         image?: string | null;
         accessToken?: string;
         provider?: string;
      };
   }
}

declare module 'next-auth/jwt' {
   interface JWT extends UserProfileFields {
      id?: string;
      accessToken?: string;
      provider?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
   }
}
