import { apiClient } from '@/lib/axios';
import { get, handleApiError } from '@/api/admin/shared';
import type {
   CustomerOrder,
   CustomerOrdersResponse,
   CreateOrderRequest,
   CreateOrderResponse,
} from '@/types/entities/order';

const CREATE_ORDER_ENDPOINT = '/order' as const;
const CUSTOMER_ORDERS_ENDPOINT = '/costmer-orders' as const;
const CREATE_ORDER_TIMEOUT_MS = 60_000;

function buildCreateOrderFormData(data: CreateOrderRequest): FormData {
   const formData = new FormData();

   formData.append('description', data.description);
   formData.append('scheduled_at', data.scheduled_at);
   formData.append('priority', data.priority ? '1' : '0');
   formData.append('career_id', String(data.career_id));

   data.services.forEach((serviceId) => {
      formData.append('services[]', String(serviceId));
   });

   formData.append('address[latitude]', String(data.address.latitude));
   formData.append('address[longitude]', String(data.address.longitude));
   formData.append('address[detailed_address]', data.address.detailed_address);
   formData.append(
      'address[area_address_id]',
      String(data.address.area_address_id)
   );

   data.images.forEach((file) => {
      formData.append('images[]', file);
   });

   return formData;
}

export const ordersApi = {
   async getAll(): Promise<CustomerOrder[]> {
      const response = await get<CustomerOrdersResponse | CustomerOrder[]>(
         CUSTOMER_ORDERS_ENDPOINT
      );

      return Array.isArray(response) ? response : response.data;
   },

   async create(data: CreateOrderRequest): Promise<CreateOrderResponse> {
      try {
         const response = await apiClient.post<CreateOrderResponse>(
            CREATE_ORDER_ENDPOINT,
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
   },
} as const;

export default ordersApi;
