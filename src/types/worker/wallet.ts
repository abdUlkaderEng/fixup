/**
 * Worker Wallet Types
 *
 * Two worker-facing endpoints:
 *  - GET /worker/wallet                 → current balance + totals
 *  - GET /worker/wallet/transactions    → paginated ledger
 */

import type { PaginatedResponse } from '@/types/admin/shared';

// ============================================
// Wallet Status
// ============================================

export type WalletStatus = 'active' | 'suspended' | 'closed';

// ============================================
// Transaction Type
// ============================================

/**
 * Backend-defined ledger entry kinds.
 * - topup     : admin credited the wallet
 * - job_fee   : platform charged a fee for accepting a job
 *
 * Kept as a union with string fallback so the UI doesn't crash on a
 * future type the backend introduces before we ship a matching label.
 */
export type WalletTransactionType = 'topup' | 'job_fee' | (string & {});

// ============================================
// Entities
// ============================================

export interface WorkerWallet {
   id: number;
   user_id: number;
   balance: number;
   total_charged: number;
   total_spent: number;
   status: WalletStatus | string;
   created_at: string | null;
   updated_at: string | null;
}

export interface WorkerWalletTransaction {
   id: number;
   wallet_id: number;
   type: WalletTransactionType;
   amount: number;
   balance_before: number;
   balance_after: number;
   reference_type: string | null;
   reference_id: number | null;
   idempotency_key: string | null;
   /** User id of the admin who performed the action (topups only). */
   performed_by: number | null;
   note: string | null;
   created_at: string;
   updated_at: string;
}

// ============================================
// Responses
// ============================================

export type WorkerWalletResponse = WorkerWallet;

export type WorkerWalletTransactionsResponse =
   PaginatedResponse<WorkerWalletTransaction>;
