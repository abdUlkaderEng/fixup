import { post } from '../shared';
import { WALLET_ENDPOINTS } from './endpoints';
import type {
   WalletTopupRequest,
   WalletTopupResponse,
} from '@/types/admin/wallet';

/**
 * Wallet Top-up API
 * Credits a worker's wallet by user_id.
 */
export const topupApi = {
   /**
    * Top up a worker's wallet.
    *
    * @param userId  Worker's user_id (path param).
    * @param data    Amount and admin note.
    */
   async create(
      userId: number,
      data: WalletTopupRequest
   ): Promise<WalletTopupResponse> {
      return await post<WalletTopupResponse, WalletTopupRequest>(
         WALLET_ENDPOINTS.TOPUP(userId),
         data
      );
   },
} as const;

export default topupApi;
