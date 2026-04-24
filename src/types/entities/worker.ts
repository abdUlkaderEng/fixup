/**
 * Worker Entity - Unified Type Definition
 * Single source of truth for Worker across the application
 */

import type { Career } from './career';

// ============================================
// Worker Status
// ============================================

export type WorkerStatus = 'waiting' | 'active' | 'blocked';

// ============================================
// Worker Service (simplified service reference)
// ============================================

export interface WorkerService {
   id: number;
   name: string;
   career_id?: number;
   created_at?: string;
   updated_at?: string;
}

// ============================================
// Base Worker Entity
// ============================================

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
}

// Worker with all relations populated (auth/session format)
export interface WorkerWithRelations extends Worker {
   career: Career;
   services: WorkerService[];
}
