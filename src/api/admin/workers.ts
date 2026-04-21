import { get, put, del, buildWorkerQuery, ENDPOINTS } from './shared';
import type {
   PaginatedWorkersResponse,
   WorkerFilters,
   WorkerStatus,
   Worker,
} from '@/types/worker';

/**
 * Worker API Module
 * Handles CRUD operations for workers with filtering and pagination
 */

// Request/Response types specific to workers
export interface UpdateWorkerRequest {
   about?: string;
   status?: WorkerStatus;
   career_id?: number;
   years_experience?: number;
}

export interface UpdateWorkerResponse {
   message: string;
   worker: Worker;
}

export interface DeleteWorkerResponse {
   message: string;
}

export const workersApi = {
   /**
    * Fetch workers with optional filtering and pagination
    */
   async getAll(
      filters: WorkerFilters = {}
   ): Promise<PaginatedWorkersResponse> {
      const queryString = buildWorkerQuery(filters);
      const url = `${ENDPOINTS.WORKERS.FILTERS}${queryString}`;
      return await get<PaginatedWorkersResponse>(url);
   },

   /**
    * Fetch pending workers specifically (status = waiting)
    */
   async getPending(
      page: number = 1,
      perPage?: number
   ): Promise<PaginatedWorkersResponse> {
      return this.getAll({
         status: 'waiting' as WorkerStatus,
         page,
         perPage,
      });
   },

   /**
    * Update worker by ID
    */
   async update(
      workerId: number,
      data: UpdateWorkerRequest
   ): Promise<UpdateWorkerResponse> {
      const url = `${ENDPOINTS.WORKERS.BASE}/${workerId}`;
      return await put<UpdateWorkerResponse, UpdateWorkerRequest>(url, data);
   },

   /**
    * Delete worker by ID
    */
   async delete(workerId: number): Promise<DeleteWorkerResponse> {
      const url = `${ENDPOINTS.WORKERS.BASE}/${workerId}`;
      return await del<DeleteWorkerResponse>(url);
   },
} as const;

export default workersApi;
