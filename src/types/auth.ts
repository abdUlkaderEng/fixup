import type { Worker } from '@/types/entities/worker';
import type { UserAddress, Area } from '@/types/entities/address';

export interface LoginRequest {
   email: string;
   password: string;
}

export interface RegisterRequest {
   name: string;
   email: string;
   phone_number: string;
   latitude: number;
   longitude: number;
   detailed_address: string;
   area_address_id: number;
   birth_date?: string;
   password: string;
   password_confirmation: string;
}

// ============================================
// User - Matches Backend Auth Response
// ============================================

export interface User {
   id: string;
   name: string;
   email: string;
   phone_number: string | null;
   birth_date: string | null;
   profile_picture: string | null;
   role: string;
   is_active: number;
   email_verified_at: string | null;
   created_at: string;
   updated_at: string;
   // Auth-specific fields
   accessToken?: string;
   provider?: string;
   // Nested relations
   address?: UserAddress | null;
   worker?: Worker | null;
   // Area info (fetched separately or nested)
   area?: Area | null;
}

export interface AuthResponse {
   token: string;
   user: User;
}

export interface UpdateCustomerProfileRequest {
   name: string;
   phone_number: string;
   profile_picture?: File | null;
   latitude?: number;
   longitude?: number;
   detailed_address?: string;
   area_address_id?: number;
}

export interface UpdateProfileResponse {
   message: string;
   user: User;
}

export interface UpdateWorkerProfileRequest {
   about: string;
   years_experience: number;
   services: number[];
   images?: File[];
   delete_images?: number[];
}

export interface UpdateWorkerProfileResponse {
   message: string;
   data: Worker;
}

export interface ApiError {
   message: string;
   errors?: Record<string, string[]>;
}

export interface RegisterWorkerRequest {
   user_id: number;
   career_id: number;
   about: string;
   years_experience: number;
   services: number[];
   images?: File[];
}
