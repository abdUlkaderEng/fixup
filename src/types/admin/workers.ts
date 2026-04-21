/**
 * Admin Types - Worker Management
 */

import type {
   PaginatedResponse,
   PaginationParams,
   MessageResponse,
} from './shared';

// ============================================
// Worker Entity
// ============================================

export type WorkerStatus = 'waiting' | 'active' | 'blocked';

export interface Worker {
   id: number;
   user_id: number;
   career_id: number;
   about: string;
   status: WorkerStatus;
   years_experience: number;
   created_at: string;
   updated_at: string;
}

// ============================================
// Filters
// ============================================

export interface WorkerFilters extends PaginationParams {
   status?: WorkerStatus;
}

// ============================================
// API Requests
// ============================================

export interface UpdateWorkerRequest {
   about?: string;
   status?: WorkerStatus;
   career_id?: number;
   years_experience?: number;
}

// ============================================
// API Responses
// ============================================

export type PaginatedWorkersResponse = PaginatedResponse<Worker>;

export interface UpdateWorkerResponse extends MessageResponse {
   worker: Worker;
}

export type DeleteWorkerResponse = MessageResponse;
