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
   const raw = response.data.data;

   // The backend serializes these aggregate values as strings (Laravel AVG/
   // decimal columns), so coerce them to numbers to honour the typed contract
   // and keep `.toFixed()` and arithmetic safe downstream.
   return {
      ...raw,
      average_rating: Number(raw.average_rating) || 0,
      ratings_count: Number(raw.ratings_count) || 0,
   };
}

/**
 * Public worker-rating API namespace.
 */
export const workerRatingApi = {
   get: getWorkerRating,
} as const;

export default workerRatingApi;
