import { createCustomerOrder } from './create-order';
import { getCustomerOrders } from './get-orders';
import { acceptCustomerOffer } from './accept-offer';

export const customerOrdersApi = {
   getAll: getCustomerOrders,
   create: createCustomerOrder,
   acceptOffer: acceptCustomerOffer,
} as const;

export { createCustomerOrder, getCustomerOrders, acceptCustomerOffer };
