import { apiClient } from '@/lib/axios';
import {
   UpdateProfileRequest,
   UpdateProfileResponse,
   ApiError,
   User,
} from '@/types/auth';
import { AxiosError } from 'axios';

const USER_ENDPOINTS = {
   UPGRADE_ACCOUNT: '/upgrade-account',
   GET_CURRENT_USER: '/user',
} as const;

const handleApiError = (error: unknown): never => {
   const axiosError = error as AxiosError<ApiError>;
   const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors?.[
         Object.keys(axiosError.response?.data?.errors || {})[0]
      ]?.[0] ||
      'حدث خطأ أثناء تحديث الملف الشخصي';
   throw new Error(message);
};

export const userApi = {
   async updateProfile(
      data: UpdateProfileRequest
   ): Promise<UpdateProfileResponse> {
      try {
         const response = await apiClient.post<UpdateProfileResponse>(
            USER_ENDPOINTS.UPGRADE_ACCOUNT,
            data
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   async getCurrentUser(): Promise<User> {
      try {
         const response = await apiClient.get<User>(
            USER_ENDPOINTS.GET_CURRENT_USER
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
};

export default userApi;
