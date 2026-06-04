import { post } from '@/api/admin/shared';
import type { CompleteOrderResponse } from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

/**
 * Customer accepts a worker's price offer.
 *
 * Backend marks the offer as `accepted` and the order as `accepted`.
 * This action is final — there is no "unaccept" endpoint.
 */
export async function completeCustomerOrder(
   orderId: number
): Promise<CompleteOrderResponse> {
   return await post<CompleteOrderResponse, Record<string, never>>(
      CUSTOMER_ORDER_ENDPOINTS.COMPLETE(orderId),
      {}
   );
}
