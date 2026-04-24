/**
 * Service Entity - Unified Type Definition
 * Single source of truth for Service across the application
 */

// ============================================
// Base Service Entity
// ============================================

export interface Service {
   id: number;
   name: string;
   career_id: number;
   created_at: string;
}

// Service with optional timestamps (for flexible use)
export interface ServiceWithTimestamps extends Service {
   updated_at?: string;
}
