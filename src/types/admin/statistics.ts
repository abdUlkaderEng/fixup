/**
 * Admin Types - Dashboard Statistics
 * Aggregate counts returned by GET /admin/statistics
 */

export interface AdminStatistics {
   services_count: number;
   careers_count: number;
   users_count: number;
   workers_count: number;
   orders_count: number;
   offers_count: number;
   login_count: number;
}

export type GetStatisticsResponse = AdminStatistics;
