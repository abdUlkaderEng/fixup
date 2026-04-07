import { apiClient } from '@/lib/axios';
import {
   AuthResponse,
   LoginRequest,
   RegisterRequest,
   ApiError,
} from '@/types/auth';
import { AxiosError } from 'axios';

const AUTH_ENDPOINTS = {
   LOGIN: '/login',
   REGISTER: '/register',
   LOGOUT: '/logout',
} as const;

const handleApiError = (error: unknown): never => {
   const axiosError = error as AxiosError<ApiError>;
   const message =
      axiosError.response?.data?.message || 'An unexpected error occurred';
   throw new Error(message);
};

export const authApi = {
   async login(data: LoginRequest): Promise<AuthResponse> {
      try {
         const response = await apiClient.post<AuthResponse>(
            AUTH_ENDPOINTS.LOGIN,
            data
         );
         console.log('LOGIN RESPONSE _______', response.data);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   async register(data: RegisterRequest): Promise<AuthResponse> {
      try {
         const response = await apiClient.post<AuthResponse>(
            AUTH_ENDPOINTS.REGISTER,
            data
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   async logout(): Promise<void> {
      try {
         await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      } catch (error) {
         handleApiError(error);
      }
   },
};

export default authApi;
