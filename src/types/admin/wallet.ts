/**
 * Admin Types - Wallet Management
 *
 * Two admin-facing wallet operations:
 *  - Job Fees: per-career fee that workers pay to accept a job.
 *    Create (POST) or update (PUT) by career_id.
 *  - Top-up: credit a worker's wallet by user_id.
 */

import type { MessageResponse } from './shared';

// ============================================
// Job Fee Entity
// ============================================

export interface JobFee {
   id: number;
   career_id: number;
   fee: number;
   is_active: boolean;
   created_at: string;
   updated_at: string;
   career?: {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
   } | null;
}

// ============================================
// Job Fees — Requests / Responses
// ============================================

export interface CreateJobFeeRequest {
   career_id: number;
   fee: number;
   is_active: boolean;
}

export interface UpdateJobFeeRequest {
   career_id: number;
   fee: number;
   is_active: boolean;
}

/**
 * Response for fetching the list of job fee rules (admin GET).
 * Matches the backend shape:
 * {
 *   message: string,
 *   data: JobFee[]
 * }
 */
export interface JobFeesListResponse extends MessageResponse {
   data: JobFee[];
}

/**
 * Create/Update response — backend returns the JobFee shape directly on
 * create/update (no `data` wrapper). Keep a single-item response type
 * for existing create/update codepaths if needed.
 */
// export interface JobFeeResponse extends MessageResponse {
//    data: JobFee;
// }
// {
//     "message": "Job fee rules retrieved successfully",
//     "data": [
//         {
//             "id": 1,
//             "career_id": 2,
//             "fee": 25,
//             "is_active": 1,
//             "created_at": "2026-06-03T14:42:07.000000Z",
//             "updated_at": "2026-06-03T14:42:07.000000Z",
//             "career": {
//                 "id": 2,
//                 "name": "تكييف",
//                 "created_at": "2026-06-03T14:35:32.000000Z",
//                 "updated_at": "2026-06-03T14:35:32.000000Z"
//             }
//         }
//     ]
// }

/**
 * Backend returns the JobFee shape directly on create/update
 * (no `data` wrapper).
 */

// ============================================
// Wallet Top-up — Requests / Responses
// ============================================

export interface WalletTopupRequest {
   amount: number;
   note: string;
}

export interface WalletTransaction {
   id: number;
   wallet_id: number;
   type: string;
   amount: number;
   balance_before: number;
   balance_after: number;
   performed_by: number;
   note: string;
   created_at: string;
   updated_at: string;
}

export interface WalletTopupResponse extends MessageResponse {
   data: WalletTransaction;
}

// ============================================
// Admin: Detailed Wallet Transaction Shape
// ============================================

export interface AdminWalletUser {
   id: number;
   name: string;
   email: string;
   email_verified_at: string | null;
   created_at: string;
   updated_at: string;
   is_active: number | boolean;
   phone_number: string | null;
   profile_image: string | null;
   birth_date: string | null;
   fcm_token: string | null;
   role: string;
}

export interface AdminWallet {
   id: number;
   user_id: number;
   balance: number;
   total_charged: number;
   total_spent: number;
   status: string;
   created_at: string;
   updated_at: string;
   user?: AdminWalletUser | null;
}

export interface AdminWalletTransaction {
   id: number;
   order_id: number | null;
   wallet_id: number;
   type: string;
   amount: number;
   balance_before: number;
   balance_after: number;
   reference_type: string | null;
   reference_id: number | null;
   idempotency_key: string | null;
   performed_by: number | null;
   note: string | null;
   created_at: string;
   updated_at: string;
   order?: unknown | null;
   wallet?: AdminWallet | null;
}

export type AdminWalletTransactionsResponse =
   import('./shared').PaginatedResponse<AdminWalletTransaction>;
