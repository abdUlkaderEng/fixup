import { post } from '@/api/admin/shared';
import type { AcceptOfferResponse } from '@/types/entities/order';
import { CUSTOMER_ORDER_ENDPOINTS } from './endpoints';

/**
 * Customer accepts a worker's price offer.
 *
 * Backend marks the offer as `accepted` and the order as `accepted`.
 * This action is final — there is no "unaccept" endpoint.
 */
export async function acceptCustomerOffer(
   orderId: number,
   offerId: number
): Promise<AcceptOfferResponse> {
   return await post<AcceptOfferResponse, Record<string, never>>(
      CUSTOMER_ORDER_ENDPOINTS.ACCEPT_OFFER(orderId, offerId),
      {}
   );
}
