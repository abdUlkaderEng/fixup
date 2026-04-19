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

export interface User {
   id: number;
   name: string;
   email: string;
   phone_number: string | null;
   latitude: number | null;
   longitude: number | null;
   detailed_address: string | null;
   area_address_id: number | null;
   birth_date: string | null;
   profile_picture: string | null;
   role: string;
   is_active: number;
   email_verified_at: string | null;
   created_at: string;
   updated_at: string;
}

export interface AuthResponse {
   token: string;
   user: User;
}

export interface UpdateProfileRequest {
   name: string;
   phone_number: string;
   latitude?: number;
   longitude?: number;
   detailed_address?: string;
   area_address_id?: number;
   birth_date?: string;
}

export interface UpdateProfileResponse {
   message: string;
   user: User;
}

export interface ApiError {
   message: string;
   errors?: Record<string, string[]>;
}

export interface RegisterWorkerRequest {
   career_id: number;
   about: string;
   years_experience: number;
   services: number[];
   images?: File[];
}

// register work didnt return anything
// export interface RegisterWorkerResponse {
//    message: string;
//    worker: {
//       id: number;
//       career_id: string;
//       about: string;
//       years_experience: number;
//       user_id: number;
//       created_at: string;
//       updated_at: string;
//    };
// }
