import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type {
   UpdateWorkerProfileRequest,
   UpdateWorkerProfileResponse,
} from '@/types/auth';

const toFormData = (data: UpdateWorkerProfileRequest): FormData => {
   const fd = new FormData();
   fd.append('_method', 'PUT');
   fd.append('about', data.about);
   fd.append('years_experience', String(data.years_experience));
   data.services.forEach((id) => fd.append('services[]', String(id)));
   data.images?.forEach((file) => fd.append('images[]', file));
   data.delete_images?.forEach((id) =>
      fd.append('delete_images[]', String(id))
   );
   return fd;
};

export const updateWorkerProfile = async (
   data: UpdateWorkerProfileRequest
): Promise<UpdateWorkerProfileResponse> => {
   try {
      const response = await apiClient.post<UpdateWorkerProfileResponse>(
         '/update-worker-profile',
         toFormData(data),
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
};
