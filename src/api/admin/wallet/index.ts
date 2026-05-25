/**
 * Admin Wallet API — Entry Point
 *
 * Two responsibilities:
 *  - Job Fees: per-career fee CRUD (POST / PUT). No list endpoint yet.
 *  - Top-up: credit a worker's wallet by user_id.
 *
 * Usage:
 *   import { walletApi } from '@/api/admin';
 *   await walletApi.jobFees.create({ career_id, fee, is_active });
 *   await walletApi.topup.create(userId, { amount, note });
 */

import { jobFeesApi } from './job-fees';
import { topupApi } from './topup';

export { jobFeesApi } from './job-fees';
export { topupApi } from './topup';
export { WALLET_ENDPOINTS } from './endpoints';

export const walletApi = {
   jobFees: jobFeesApi,
   topup: topupApi,
} as const;

export default walletApi;
