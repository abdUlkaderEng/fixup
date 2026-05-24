import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/admin/shared';
import type {
   CreateOrderRequest,
   CreateOrderResponse,
} from '@/types/entities/order';
import { CREATE_ORDER_TIMEOUT_MS, CUSTOMER_ORDER_ENDPOINTS } from './endpoints';
import { buildCreateOrderFormData } from './form-data';

export async function createCustomerOrder(
   data: CreateOrderRequest
): Promise<CreateOrderResponse> {
   try {
      const response = await apiClient.post<CreateOrderResponse>(
         CUSTOMER_ORDER_ENDPOINTS.CREATE,
         buildCreateOrderFormData(data),
         {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: CREATE_ORDER_TIMEOUT_MS,
         }
      );
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}
