import { get, buildQueryString } from '@/api/admin/shared';
import type {
   AdminWalletTransaction,
   AdminWalletTransactionsResponse,
} from '@/types/admin/wallet';

export interface AdminWalletTransactionsParams {
   page?: number;
   perPage?: number;
}

const ADMIN_WALLET_TRANSACTIONS_ENDPOINT = '/admin/wallet-transactions';

function emptyTransactionsPage(
   perPage: number
): AdminWalletTransactionsResponse {
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

function normalizeTransactionsResponse(
   response: unknown,
   perPage: number
): AdminWalletTransactionsResponse {
   if (!response) {
      return emptyTransactionsPage(perPage);
   }

   const envelope =
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      !Array.isArray((response as { data?: unknown }).data) &&
      typeof (response as { data?: unknown }).data === 'object'
         ? (response as { data: unknown }).data
         : response;

   if (Array.isArray(envelope)) {
      return {
         ...emptyTransactionsPage(perPage),
         data: envelope as AdminWalletTransaction[],
         to: envelope.length,
         total: envelope.length,
      };
   }

   if (
      typeof envelope !== 'object' ||
      envelope === null ||
      !Array.isArray((envelope as { data?: unknown }).data)
   ) {
      return emptyTransactionsPage(perPage);
   }

   const page = envelope as Partial<AdminWalletTransactionsResponse> & {
      meta?: Partial<{
         current_page: number;
         last_page: number;
         per_page: number;
         total: number;
         from: number;
         to: number;
      }>;
   };

   return {
      current_page: page.current_page ?? page.meta?.current_page ?? 1,
      data: page.data ?? [],
      first_page_url: page.first_page_url ?? '',
      from: page.from ?? page.meta?.from ?? 0,
      last_page: page.last_page ?? page.meta?.last_page ?? 1,
      last_page_url: page.last_page_url ?? '',
      links: page.links ?? [],
      next_page_url: page.next_page_url ?? null,
      path: page.path ?? '',
      per_page: page.per_page ?? page.meta?.per_page ?? perPage,
      prev_page_url: page.prev_page_url ?? null,
      to: page.to ?? page.meta?.to ?? page.data?.length ?? 0,
      total: page.total ?? page.meta?.total ?? page.data?.length ?? 0,
   };
}

export async function getAdminWalletTransactions(
   params: AdminWalletTransactionsParams = {}
): Promise<AdminWalletTransactionsResponse> {
   const query = buildQueryString({
      page: params.page && params.page > 1 ? params.page : undefined,
      per_page: params.perPage,
   });

   const response = await get<unknown>(
      `${ADMIN_WALLET_TRANSACTIONS_ENDPOINT}${query}`
   );

   return normalizeTransactionsResponse(response, params.perPage ?? 20);
}

export const adminWalletTransactionsApi = {
   getTransactions: getAdminWalletTransactions,
} as const;

export default adminWalletTransactionsApi;
