/**
 * Career Entity - Unified Type Definition
 * Single source of truth for Career across the application
 */

// ============================================
// Base Career Entity
// ============================================

export interface Career {
   id: number;
   name: string;
}

// Career with timestamps (API response format)
export interface CareerWithTimestamp extends Career {
   created_at: string;
   updated_at?: string;
}

// Alias for public API compatibility
export type PublicCareer = CareerWithTimestamp;
