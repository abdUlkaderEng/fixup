import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';

const NOTIFICATIONS_ENDPOINTS = {
   REGISTER_DEVICE: '/device-register',
} as const;

export interface RegisterDeviceRequest {
   fcm_token: string;
   device_type?: 'android' | 'ios' | null;
}

export interface RegisterDeviceResponse {
   message: string;
}

export const notificationsApi = {
   async registerDevice(
      data: RegisterDeviceRequest
   ): Promise<RegisterDeviceResponse> {
      try {
         const response = await apiClient.post<RegisterDeviceResponse>(
            NOTIFICATIONS_ENDPOINTS.REGISTER_DEVICE,
            data
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
};

export default notificationsApi;
