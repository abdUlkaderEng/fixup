import { createCustomerOrder } from './create-order';
import { getCustomerOrders } from './get-orders';

export const customerOrdersApi = {
   getAll: getCustomerOrders,
   create: createCustomerOrder,
} as const;

export { createCustomerOrder, getCustomerOrders };
