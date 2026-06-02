import { post } from '@/api/admin/shared';
import type { CancelOrderResponse } from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

/**
 * Customer cancels one of their own orders.
 *
 * Only meaningful while the order has not received any price offers — the UI
 * only exposes this action for such orders, and the backend enforces the rule.
 */
export async function cancelCustomerOrder(
   orderId: number
): Promise<CancelOrderResponse> {
   return await post<CancelOrderResponse, Record<string, never>>(
      CUSTOMER_ORDER_ENDPOINTS.CANCEL(orderId),
      {}
   );
}
