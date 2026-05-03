/**
 * Worker Entity - Unified Type Definition
 * Single source of truth for Worker across the application
 */

import type { Career } from './career';

// ============================================
// Worker Status
// ============================================

export type WorkerStatus = 'active' | 'waiting' | 'blocked';

// ============================================
// Nested User Shapes
// ============================================

export interface WorkerUserAddress {
   id: number;
   user_id: number;
   latitude: string;
   longitude: string;
   detailed_address: string;
   area_address_id: number;
   created_at: string;
   updated_at: string;
   area_address: {
      id: number;
      area_name: string;
      created_at: string;
      updated_at: string;
   };
}

export interface WorkerUser {
   id: number;
   name: string;
   email: string;
   email_verified_at: string | null;
   phone_number: string | null;
   profile_image: string | null;
   birth_date: string | null;
   is_active: number;
   role: string;
   created_at: string;
   updated_at: string;
   address: WorkerUserAddress | null;
}

// ============================================
// Worker Sub-Entities
// ============================================

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
   user_id: number;
   worker_id: number;
   order_id: number | null;
   gallery_work_id: number | null;
   path: string;
   created_at: string;
   updated_at: string;
}

// ============================================
// Worker Entity
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
   user: WorkerUser;
   career: Career;
   services: WorkerService[];
   images: WorkerImage[];
}
