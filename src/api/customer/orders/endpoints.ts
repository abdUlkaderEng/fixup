export const CUSTOMER_ORDER_ENDPOINTS = {
   CREATE: '/order',
   LIST: '/costmer-orders',
   ACCEPT_OFFER: (orderId: number, offerId: number) =>
      `/orders/${orderId}/offers/${offerId}/accept`,
   CANCEL: (orderId: number) => `/orders/${orderId}/cancel`,
} as const;

export const CREATE_ORDER_TIMEOUT_MS = 60_000;
