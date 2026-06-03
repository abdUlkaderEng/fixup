import { createCustomerOrder } from './create-order';
import { getCustomerOrders } from './get-orders';
import { acceptCustomerOffer } from './accept-offer';
import { cancelCustomerOrder } from './cancel-order';
import { rateCustomerOrder } from './rate-order';

export const customerOrdersApi = {
   getAll: getCustomerOrders,
   create: createCustomerOrder,
   acceptOffer: acceptCustomerOffer,
   cancel: cancelCustomerOrder,
   rate: rateCustomerOrder,
} as const;

export {
   createCustomerOrder,
   getCustomerOrders,
   acceptCustomerOffer,
   cancelCustomerOrder,
   rateCustomerOrder,
};
