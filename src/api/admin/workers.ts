import { apiClient } from '@/lib/axios';
import {
   get,
   put,
   del,
   buildWorkerQuery,
   handleApiError,
   ENDPOINTS,
} from './shared';
import type {
   PaginatedWorkersResponse,
   WorkerFilters,
   WorkerStatus,
   Worker,
   UpdateWorkerRequest,
} from '@/types/admin/index';

/**
 * Worker API Module
 * Handles CRUD operations for workers with filtering and pagination
 */

export interface UpdateWorkerResponse {
   message: string;
   worker: Worker;
}

export interface DeleteWorkerResponse {
   message: string;
}

export const workersApi = {
   async getAll(
      filters: WorkerFilters = {}
   ): Promise<PaginatedWorkersResponse> {
      const queryString = buildWorkerQuery(filters);
      return await get<PaginatedWorkersResponse>(
         `${ENDPOINTS.WORKERS.BASE}${queryString}`
      );
   },

   async getFiltered(
      filters: WorkerFilters = {}
   ): Promise<PaginatedWorkersResponse> {
      const queryString = buildWorkerQuery(filters);
      return await get<PaginatedWorkersResponse>(
         `/admin/workers/filters${queryString}`
      );
   },

   async getPending(
      page = 1,
      perPage?: number
   ): Promise<PaginatedWorkersResponse> {
      return this.getAll({ status: 'waiting' as WorkerStatus, page, perPage });
   },

   async update(
      workerId: number,
      data: UpdateWorkerRequest
   ): Promise<UpdateWorkerResponse> {
      return await put<UpdateWorkerResponse, UpdateWorkerRequest>(
         `${ENDPOINTS.WORKERS.BASE}/${workerId}`,
         data
      );
   },

   async delete(workerId: number): Promise<DeleteWorkerResponse> {
      return await del<DeleteWorkerResponse>(
         `${ENDPOINTS.WORKERS.BASE}/${workerId}`
      );
   },

   /** Delete a single worker image by image ID */
   async deleteImage(imageId: number): Promise<{ message: string }> {
      return await del<{ message: string }>(`/admin/worker-images/${imageId}`);
   },

   /** Upload new images for a worker (multipart/form-data) */
   async uploadImages(
      workerId: number,
      files: File[]
   ): Promise<{ message: string; images: Worker['images'] }> {
      try {
         const form = new FormData();
         files.forEach((file) => form.append('images[]', file));
         const res = await apiClient.post<{
            message: string;
            images: Worker['images'];
         }>(`/admin/worker/${workerId}/images`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });
         return res.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
} as const;

export default workersApi;
