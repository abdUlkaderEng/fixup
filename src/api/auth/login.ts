import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type { AuthResponse, LoginRequest } from '@/types/auth';
import { AUTH_ENDPOINTS } from './endpoints';

export async function authLogin(data: LoginRequest): Promise<AuthResponse> {
   try {
      const response = await apiClient.post<AuthResponse>(
         AUTH_ENDPOINTS.LOGIN,
         data
      );
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}
