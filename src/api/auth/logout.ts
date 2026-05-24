import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import { AUTH_ENDPOINTS } from './endpoints';

export async function authLogout(): Promise<void> {
   try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
   } catch (error) {
      handleApiError(error);
   }
}
