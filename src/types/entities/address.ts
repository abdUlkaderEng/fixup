/**
 * Address/Area Entity - Unified Type Definition
 * Single source of truth for Address/Area across the application
 */

// ============================================
// Base Area Entity (API format)
// ============================================

export interface Area {
   id: number;
   area_name: string;
   created_at: string;
   updated_at?: string;
}

// Alias for backward compatibility
export type Address = Area;

// Alias for public API compatibility
export type PublicArea = Area;
