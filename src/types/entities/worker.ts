/**
 * Worker Entity - Unified Type Definition
 * Single source of truth for Worker across the application
 */

import type { Career } from './career';

// ============================================
// Worker Status
// ============================================

export type WorkerStatus = 'active' | 'waiting' | 'blocked';

export interface WorkerService {
   id: number;
   name: string;
   career_id?: number;
   created_at?: string;
   updated_at?: string;
   pivot?: { worker_id: number; service_id: number };
}

export interface WorkerImage {
   id: number;
   path: string;
   worker_id: number;
}

export interface Worker {
   id: number;
   user_id: number;
   career_id: number;
   about: string | null;
   years_experience: number | null;
   status: WorkerStatus;
   created_at: string;
   updated_at: string;
   career?: Career | null;
   services?: WorkerService[];
   images?: WorkerImage[];
}
