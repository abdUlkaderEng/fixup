import { get } from '@/api/admin/shared';
import { WORKER_ENDPOINTS } from '../shared/endpoints';
import type { WorkerWalletResponse } from '@/types/worker/wallet';

/**
 * Fetch the authenticated worker's wallet snapshot:
 * balance, total_charged, total_spent, status.
 */
export async function getWorkerWallet(): Promise<WorkerWalletResponse> {
   return await get<WorkerWalletResponse>(WORKER_ENDPOINTS.WALLET);
}
