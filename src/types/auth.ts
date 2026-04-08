export interface LoginRequest {
   email: string;
   password: string;
}

export interface RegisterRequest {
   name: string;
   email: string;
   phone: string;
   address?: string;
   birth_date?: string;
   password: string;
   password_confirmation: string;
}

export interface User {
   id: number;
   name: string;
   email: string;
   phone: string | null;
   address: string | null;
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
   phone: string;
   address?: string;
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
