/**
 * Wallet API Endpoints
 * Single source of truth for wallet-related URLs.
 */

export const WALLET_ENDPOINTS = {
   JOB_FEES: '/admin/wallet/job-fees',
   JOB_FEE_BY_CAREER: (careerId: number) =>
      `/admin/wallet/job-fees/${careerId}`,
   TOPUP: (userId: number | string) => `/admin/wallet/topup/${userId}`,
} as const;
