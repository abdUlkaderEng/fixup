import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type { RegisterRequest } from '@/types/auth';
import { AUTH_ENDPOINTS } from './endpoints';

export async function authRegister(data: RegisterRequest): Promise<void> {
   try {
      await apiClient.post(AUTH_ENDPOINTS.REGISTER, data);
   } catch (error) {
      handleApiError(error);
   }
}
