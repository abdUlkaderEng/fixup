import { get, buildQueryString } from '@/api/admin/shared';
import type {
   CustomerOrder,
   CustomerOrderFilters,
   CustomerOrdersResponse,
} from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

/**
 * Fetch the authenticated customer's orders, optionally filtered by status
 * (`pending` | `accepted` | `rejected` | `expired` | `cancelled`).
 */
export async function getCustomerOrders(
   filters: CustomerOrderFilters = {}
): Promise<CustomerOrder[]> {
   const query = buildQueryString({ status: filters.status });
   const response = await get<CustomerOrdersResponse | CustomerOrder[]>(
      `${CUSTOMER_ORDER_ENDPOINTS.LIST}${query}`
   );

   return Array.isArray(response) ? response : response.data;
}
