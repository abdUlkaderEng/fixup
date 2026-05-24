import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type {
   UpdateWorkerProfileRequest,
   UpdateWorkerProfileResponse,
} from '@/types/auth';
import { WORKER_ENDPOINTS } from '../shared/endpoints';
import { buildUpdateWorkerProfileFormData } from './form-data';

export async function updateWorkerProfile(
   data: UpdateWorkerProfileRequest
): Promise<UpdateWorkerProfileResponse> {
   try {
      const response = await apiClient.post<UpdateWorkerProfileResponse>(
         WORKER_ENDPOINTS.PROFILE_UPDATE,
         buildUpdateWorkerProfileFormData(data),
         { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}
