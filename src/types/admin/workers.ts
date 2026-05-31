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
   /** Filter by (partial) phone number. */
   phone_number?: string;
   /** Filter by (partial) worker name. */
   name?: string;
   // Filtering by career is disabled for now — re-enable when needed.
   // /** Filter by the worker's career id. */
   // career_id?: number;
}

// ============================================
// API Requests
// ============================================

export interface UpdateWorkerRequest {
   about?: string;
   status?: WorkerStatus;
   career_id?: number;
   years_experience?: number;
   service_ids?: number[];
}

// ============================================
// API Responses
// ============================================

export type PaginatedWorkersResponse = PaginatedResponse<Worker>;

export interface UpdateWorkerResponse extends MessageResponse {
   worker: Worker;
}

export type DeleteWorkerResponse = MessageResponse;
