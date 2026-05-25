/**
 * Worker Wallet API — Entry Point
 *
 * Worker-side, read-only:
 *  - getWallet()       → GET /worker/wallet
 *  - getTransactions() → GET /worker/wallet/transactions
 */

import { getWorkerWallet } from './get-wallet';
import {
   getWorkerWalletTransactions,
   type WalletTransactionsParams,
} from './get-transactions';

export const workerWalletApi = {
   getWallet: getWorkerWallet,
   getTransactions: getWorkerWalletTransactions,
} as const;

export type { WalletTransactionsParams };

export default workerWalletApi;
