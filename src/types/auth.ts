export interface LoginRequest {
   email: string;
   password: string;
}

export interface RegisterRequest {
   name: string;
   email: string;
   phone: string;
   password: string;
   password_confirmation: string;
}

export interface User {
   id: number;
   name: string;
   email: string;
   phone: string | null;
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

export interface ApiError {
   message: string;
   errors?: Record<string, string[]>;
}
