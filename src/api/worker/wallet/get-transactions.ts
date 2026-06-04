import { get, buildQueryString } from '@/api/admin/shared';
import { WORKER_ENDPOINTS } from '../shared/endpoints';
import type { WorkerWalletTransactionsResponse } from '@/types/worker/wallet';

export interface WalletTransactionsParams {
   page?: number;
   perPage?: number;
}

/** Empty Laravel-style page, used when the worker has no wallet yet. */
function emptyTransactionsPage(
   perPage: number
): WorkerWalletTransactionsResponse {
   return {
      current_page: 1,
      data: [],
      first_page_url: '',
      from: 0,
      last_page: 1,
      last_page_url: '',
      links: [],
      next_page_url: null,
      path: '',
      per_page: perPage,
      prev_page_url: null,
      to: 0,
      total: 0,
   };
}

/**
 * Fetch the authenticated worker's wallet ledger (paginated).
 * Backend returns the Laravel pagination envelope.
 *
 * Workers still awaiting admin approval have no wallet yet, so the backend
 * responds with a non-paginated payload (e.g. a message) instead of the ledger
 * envelope. We validate the shape and normalize it to an empty page so the UI
 * never maps over a non-array.
 */
export async function getWorkerWalletTransactions(
   params: WalletTransactionsParams = {}
): Promise<WorkerWalletTransactionsResponse> {
   const query = buildQueryString({
      page: params.page && params.page > 1 ? params.page : undefined,
      per_page: params.perPage,
   });
   const response = await get<WorkerWalletTransactionsResponse>(
      `${WORKER_ENDPOINTS.WALLET_TRANSACTIONS}${query}`
   );

   // Backend may return different shapes depending on worker state or
   // server middleware. Expected shape: Laravel pagination envelope
   // (object with `data: []`). Some responses may wrap that envelope
   // inside another `data` property (e.g. `{ data: { current_page, data: [...] } }`).
   // Normalize both shapes so the UI always receives a proper page.

   if (!response) {
      return emptyTransactionsPage(params.perPage ?? 20);
   }

   // Case A: expected envelope { current_page, data: [...] }
   if (Array.isArray((response as any).data)) {
      return response as WorkerWalletTransactionsResponse;
   }

   // Case B: envelope wrapped under `data` (e.g. { data: { ...envelope } })
   if ((response as any).data && Array.isArray((response as any).data.data)) {
      const inner = (response as any).data;
      return {
         current_page: inner.current_page ?? inner.meta?.current_page ?? 1,
         data: inner.data,
         first_page_url: inner.first_page_url ?? '',
         from: inner.from ?? 0,
         last_page: inner.last_page ?? inner.meta?.last_page ?? 1,
         last_page_url: inner.last_page_url ?? '',
         links: inner.links ?? [],
         next_page_url: inner.next_page_url ?? null,
         path: inner.path ?? '',
         per_page: inner.per_page ?? params.perPage ?? 20,
         prev_page_url: inner.prev_page_url ?? null,
         to: inner.to ?? 0,
         total: inner.total ?? inner.meta?.total ?? inner.data.length ?? 0,
      } as WorkerWalletTransactionsResponse;
   }

   return emptyTransactionsPage(params.perPage ?? 20);
}
