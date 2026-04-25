import { AxiosError } from 'axios';
import type { ApiError } from '@/types/auth';

export const handleApiError = (error: unknown): never => {
   const axiosError = error as AxiosError<ApiError>;
   const firstFieldError = axiosError.response?.data?.errors
      ? Object.values(axiosError.response.data.errors)[0]?.[0]
      : undefined;
   throw new Error(
      firstFieldError ||
         axiosError.response?.data?.message ||
         'حدث خطأ غير متوقع'
   );
};
