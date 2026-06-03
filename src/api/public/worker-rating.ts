import { apiClient } from '@/lib/axios';
import type {
   WorkerRating,
   WorkerRatingResponse,
} from '@/types/entities/worker';

/**
 * Fetch a worker's aggregate rating (average + count).
 *
 * Endpoint: GET /workers/{workerId}/rating
 * Response: { data: { average_rating, ratings_count } }
 */
export async function getWorkerRating(workerId: number): Promise<WorkerRating> {
   const response = await apiClient.get<WorkerRatingResponse>(
      `/workers/${workerId}/rating`
   );
   return response.data.data;
}

/**
 * Public worker-rating API namespace.
 */
export const workerRatingApi = {
   get: getWorkerRating,
} as const;

export default workerRatingApi;
