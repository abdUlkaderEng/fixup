import { apiClient } from '@/lib/axios';
import {
   AuthResponse,
   LoginRequest,
   RegisterRequest,
   ApiError,
   RegisterWorkerRequest,
} from '@/types/auth';
import { AxiosError } from 'axios';

const AUTH_ENDPOINTS = {
   LOGIN: '/login',
   REGISTER: '/register',
   LOGOUT: '/logout',
   REGISTER_WORKER: '/register-worker',
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
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   // async register(data: RegisterRequest): Promise<AuthResponse> {
   //    try {
   //       const response = await apiClient.post<AuthResponse>(
   //          AUTH_ENDPOINTS.REGISTER,
   //          data
   //       );
   //       return response.data;
   //    } catch (error) {
   //       return handleApiError(error);
   //    }
   // },

   async register(data: RegisterRequest): Promise<void> {
      try {
         await apiClient.post(AUTH_ENDPOINTS.REGISTER, data);
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

   async registerWorker(data: RegisterWorkerRequest): Promise<void> {
      try {
         const formData = new FormData();
         formData.append('career_id', String(data.career_id));
         formData.append('about', data.about);
         formData.append('years_experience', String(data.years_experience));
         data.services.forEach((service) => {
            formData.append('services[]', String(service));
         });
         if (data.images) {
            data.images.forEach((image) => {
               formData.append('images[]', image);
            });
         }

         const response = await apiClient.post(
            AUTH_ENDPOINTS.REGISTER_WORKER,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
};

export default authApi;
