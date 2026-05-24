import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type { RegisterWorkerRequest } from '@/types/auth';
import { AUTH_ENDPOINTS } from './endpoints';
import { buildRegisterWorkerFormData } from './form-data';

export async function authRegisterWorker(
   data: RegisterWorkerRequest
): Promise<void> {
   try {
      await apiClient.post(
         AUTH_ENDPOINTS.REGISTER_WORKER,
         buildRegisterWorkerFormData(data),
         { headers: { 'Content-Type': 'multipart/form-data' } }
      );
   } catch (error) {
      handleApiError(error);
   }
}
