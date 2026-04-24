/**
 * Admin Types - Worker Management
 */

import type {
   PaginatedResponse,
   PaginationParams,
   MessageResponse,
} from './shared';
import type { Worker, WorkerStatus } from '@/types/entities/worker';

// ============================================
// Worker Entity (Re-export from entities)
// ============================================

export type { Worker, WorkerStatus };

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
