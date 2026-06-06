/**
 * Public Statistics Types
 * Response shapes for public (unauthenticated) statistics endpoints.
 */

/** Aggregate platform counters surfaced on the public homepage. */
export interface HomepageStatistics {
   /** Total registered customers. */
   users_count: number;
   /** Total approved workers. */
   workers_count: number;
}

/**
 * Response for GET /statistics/homepage — a bare object, e.g.
 * `{ "users_count": 100, "workers_count": 50 }`.
 */
export type HomepageStatisticsResponse = HomepageStatistics;
