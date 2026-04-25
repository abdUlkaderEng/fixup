import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type {
   UpdateCustomerProfileRequest,
   UpdateProfileResponse,
} from '@/types/auth';

const toFormData = (data: UpdateCustomerProfileRequest): FormData => {
   const fd = new FormData();
   fd.append('name', data.name);
   fd.append('phone_number', data.phone_number);
   if (data.profile_picture) fd.append('profile_picture', data.profile_picture);
   if (data.latitude != null) fd.append('latitude', String(data.latitude));
   if (data.longitude != null) fd.append('longitude', String(data.longitude));
   if (data.detailed_address)
      fd.append('detailed_address', data.detailed_address);
   if (data.area_address_id != null)
      fd.append('area_address_id', String(data.area_address_id));
   return fd;
};

export const updateUserProfile = async (
   data: UpdateCustomerProfileRequest
): Promise<UpdateProfileResponse> => {
   try {
      const response = await apiClient.put<UpdateProfileResponse>(
         '/update-user-profile',
         toFormData(data)
      );
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
};
