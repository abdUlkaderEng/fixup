import type { User } from 'next-auth';
import type { User as BackendUser } from '@/types/auth';

interface GoogleProfile {
   email?: string | null;
   name?: string | null;
   sub?: string;
   image?: string | null;
}

export const mapBackendUserToAuthUser = (
   backendUser: BackendUser,
   accessToken?: string
): User => ({
   id: String(backendUser.id),
   name: backendUser.name,
   email: backendUser.email,
   image: backendUser.profile_picture,
   accessToken,
   phone_number: backendUser.phone_number,
   latitude: backendUser.latitude,
   longitude: backendUser.longitude,
   detailed_address: backendUser.detailed_address,
   area_address_id: backendUser.area_address_id,
   birth_date: backendUser.birth_date,
   role: backendUser.role,
   email_verified_at: backendUser.email_verified_at,
   created_at: backendUser.created_at,
   updated_at: backendUser.updated_at,
   is_active: backendUser.is_active,
   profile_picture: backendUser.profile_picture,
});

export const mapGoogleProfileToAuthUser = (
   profile: GoogleProfile,
   backendUser: BackendUser,
   token: string
): User => ({
   id: String(backendUser.id),
   name: backendUser.name ?? profile.name,
   email: backendUser.email ?? profile.email,
   image: backendUser.profile_picture ?? profile.image,
   accessToken: token,
   phone_number: backendUser.phone_number,
   latitude: backendUser.latitude,
   longitude: backendUser.longitude,
   detailed_address: backendUser.detailed_address,
   area_address_id: backendUser.area_address_id,
   birth_date: backendUser.birth_date,
   role: backendUser.role,
   email_verified_at: backendUser.email_verified_at,
   created_at: backendUser.created_at,
   updated_at: backendUser.updated_at,
   is_active: backendUser.is_active,
   profile_picture: backendUser.profile_picture,
});

export const syncUserToToken = (
   token: Record<string, unknown>,
   user: User
): void => {
   Object.assign(token, {
      id: user.id,
      accessToken: user.accessToken,
      name: user.name,
      email: user.email,
      image: user.image,
      phone_number: user.phone_number,
      latitude: user.latitude,
      longitude: user.longitude,
      detailed_address: user.detailed_address,
      area_address_id: user.area_address_id,
      birth_date: user.birth_date,
      role: user.role,
      email_verified_at: user.email_verified_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_active: user.is_active,
      profile_picture: user.profile_picture,
   });
};

export const syncTokenToSession = (
   sessionUser: Record<string, unknown>,
   token: Record<string, unknown>
): void => {
   Object.assign(sessionUser, {
      id: token.id,
      accessToken: token.accessToken,
      provider: token.provider,
      name: token.name,
      email: token.email,
      image: token.image,
      phone_number: token.phone_number,
      latitude: token.latitude,
      longitude: token.longitude,
      detailed_address: token.detailed_address,
      area_address_id: token.area_address_id,
      birth_date: token.birth_date,
      role: token.role,
      email_verified_at: token.email_verified_at,
      created_at: token.created_at,
      updated_at: token.updated_at,
      is_active: token.is_active,
      profile_picture: token.profile_picture,
   });
};

export const updateTokenFromSession = (
   token: Record<string, unknown>,
   sessionUser: Record<string, unknown>
): void => {
   const updatableFields = [
      'name',
      'phone_number',
      'latitude',
      'longitude',
      'detailed_address',
      'area_address_id',
      'birth_date',
      'email',
      'role',
      'profile_picture',
      'email_verified_at',
      'updated_at',
   ];

   updatableFields.forEach((field) => {
      if (sessionUser[field] !== undefined) {
         token[field] = sessionUser[field] ?? token[field];
      }
   });
};
