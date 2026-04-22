/**
 * Public Careers Types
 * Response shapes for public (unauthenticated) career endpoints
 */

// ============================================
// Career Entity
// ============================================

export interface PublicCareer {
   id: number;
   name: string;
   created_at: string;
}

// ============================================
// API Response
// ============================================

/**
 * Response for GET /careers
 * Simple list response without pagination
 */
export interface PublicCareersResponse {
   data: PublicCareer[];
}
