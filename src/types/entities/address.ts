/**
 * Address/Area Entity - Unified Type Definition
 * Single source of truth for Address/Area across the application
 */

// ============================================
// Base Area Entity (Public API format)
// ============================================

export interface Area {
   id: number;
   area_name: string;
   created_at: string;
   updated_at?: string;
}

// ============================================
// User Address Entity (Auth/User API format)
// Returned as nested object in login/user response
// ============================================

export interface UserAddress {
   id: number;
   user_id: number;
   area_address_id: number;
   detailed_address: string;
   latitude: string;
   longitude: string;
   created_at: string;
   updated_at: string;
   area_address?: Area | null;
}

// Alias for backward compatibility
export type Address = UserAddress;

// Alias for public API compatibility
export type PublicArea = Area;
