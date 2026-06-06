/**
 * Public API - Main Entry Point
 * Unauthenticated endpoints for public reference data
 */

// Services
export { publicServicesApi, getServices } from './services';

// Careers
export { publicCareersApi, getCareers } from './careers';

// Areas
export { publicAreasApi, getAreas } from './areas';

// Worker rating
export { workerRatingApi, getWorkerRating } from './worker-rating';

// Statistics
export { statisticsApi, getHomepageStatistics } from './statistics';

// Types
export type {
   PublicServicesResponse,
   PublicServiceFilters,
   PublicPaginationLinks,
   PublicPaginationMeta,
} from '@/types/public/services';
export type {
   HomepageStatistics,
   HomepageStatisticsResponse,
} from '@/types/public/statistics';
