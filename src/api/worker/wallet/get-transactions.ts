import { get, buildQueryString } from '@/api/admin/shared';
import { WORKER_ENDPOINTS } from '../shared/endpoints';
import type { WorkerWalletTransactionsResponse } from '@/types/worker/wallet';

export interface WalletTransactionsParams {
   page?: number;
   perPage?: number;
}

/**
 * Fetch the authenticated worker's wallet ledger (paginated).
 * Backend returns the Laravel pagination envelope.
 */
export async function getWorkerWalletTransactions(
   params: WalletTransactionsParams = {}
): Promise<WorkerWalletTransactionsResponse> {
   const query = buildQueryString({
      page: params.page && params.page > 1 ? params.page : undefined,
      per_page: params.perPage,
   });
   return await get<WorkerWalletTransactionsResponse>(
      `${WORKER_ENDPOINTS.WALLET_TRANSACTIONS}${query}`
   );
}
