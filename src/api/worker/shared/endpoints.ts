export const WORKER_ENDPOINTS = {
   PROFILE_UPDATE: '/update-worker-profile',
   PENDING_ORDERS: '/worker/orders',
   PENDING_OFFERS: '/worker/offers',
   CONFIRMED_OFFERS: '/worker/offers/accepted',
   REQUEST_COMPLETION: (orderId: number) =>
      `/worker/orders/${orderId}/request-completion`,
   PRICE_OFFERS: '/price-offers',
   NOTIFICATIONS: '/notifications_orders',
   NOTIFICATION_MARK_READ: (id: number) => `/notifications/${id}/mark-read`,
   WALLET: '/worker/wallet',
   WALLET_TRANSACTIONS: '/worker/wallet/transactions',
} as const;
