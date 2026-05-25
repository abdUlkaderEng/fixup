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
 * Backend returns the JobFee shape directly on create/update
 * (no `data` wrapper).
 */
export type JobFeeResponse = JobFee;

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
