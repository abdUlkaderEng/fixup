import { post } from '@/api/admin/shared';
import type {
   RateOrderRequest,
   RateOrderResponse,
} from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

/**
 * Customer rates the worker who handled a completed order.
 *
 * `rate` is an integer star value (1–5). Only meaningful for completed orders —
 * the UI only exposes the action there.
 */
export async function rateCustomerOrder(
   orderId: number,
   rate: number
): Promise<RateOrderResponse> {
   return await post<RateOrderResponse, RateOrderRequest>(
      CUSTOMER_ORDER_ENDPOINTS.RATE,
      { order_id: orderId, rate }
   );
}
