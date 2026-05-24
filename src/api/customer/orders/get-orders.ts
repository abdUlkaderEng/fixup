import { get } from '@/api/admin/shared';
import type {
   CustomerOrder,
   CustomerOrdersResponse,
} from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
   const response = await get<CustomerOrdersResponse | CustomerOrder[]>(
      CUSTOMER_ORDER_ENDPOINTS.LIST
   );

   return Array.isArray(response) ? response : response.data;
}
