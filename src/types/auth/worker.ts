/**
 * Worker/Auth Nested Types
 * Used in auth/session payloads returned from backend login
 */

import type { Career } from '@/types/entities/career';
import type { Worker, WorkerService } from '@/types/entities/worker';

// ============================================
// Re-exports from entities (single source of truth)
// ============================================

export type { Career, Worker, WorkerService };
