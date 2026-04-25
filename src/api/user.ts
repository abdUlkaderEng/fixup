import { apiClient } from '@/lib/axios';
import type { ApiError, User } from '@/types/auth';
import { AxiosError } from 'axios';

const handleApiError = (error: unknown): never => {
   const axiosError = error as AxiosError<ApiError>;
   throw new Error(
      axiosError.response?.data?.message || 'حدث خطأ أثناء جلب بيانات المستخدم'
   );
};

export const userApi = {
   async getCurrentUser(): Promise<User> {
      try {
         const response = await apiClient.get<User>('/user');
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
};

export default userApi;
