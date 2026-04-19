import { apiClient } from '@/lib/axios';
import {
   PaginatedWorkersResponse,
   WorkerFilters,
   WorkerStatus,
   Worker,
} from '@/types/worker';
import {
   Service,
   Career,
   ServiceFilters,
   PaginatedServicesResponse,
   CreateServiceRequest,
   UpdateServiceRequest,
   ServiceResponse,
   DeleteServiceResponse,
} from '@/types/service';
import { ApiError } from '@/types/auth';
import { AxiosError } from 'axios';

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

const ADMIN_ENDPOINTS = {
   WORKERS: {
      FILTERS: '/admin/workers/filters',
      BASE: '/admin/worker',
   },
   SERVICES: {
      BASE: '/admin/services',
   },
   CAREERS: {
      BASE: '/admin/careers',
   },
} as const;

const handleApiError = (error: unknown): never => {
   const axiosError = error as AxiosError<ApiError>;
   const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors?.[
         Object.keys(axiosError.response?.data?.errors || {})[0]
      ]?.[0] ||
      'حدث خطأ أثناء جلب البيانات';
   throw new Error(message);
};

const buildQueryString = (filters: WorkerFilters): string => {
   const params = new URLSearchParams();

   if (filters.status) {
      params.append('status', filters.status);
   }
   if (filters.page && filters.page > 1) {
      params.append('page', String(filters.page));
   }
   if (filters.perPage) {
      params.append('per_page', String(filters.perPage));
   }

   const query = params.toString();
   return query ? `?${query}` : '';
};

const buildServicesQueryString = (filters: ServiceFilters): string => {
   const params = new URLSearchParams();

   if (filters.career_id) {
      params.append('career_id', String(filters.career_id));
   }
   if (filters.page && filters.page > 1) {
      params.append('page', String(filters.page));
   }
   if (filters.perPage) {
      params.append('per_page', String(filters.perPage));
   }

   const query = params.toString();
   return query ? `?${query}` : '';
};

export const adminApi = {
   /**
    * Fetch workers with optional filtering and pagination
    * @param filters - Optional status filter and pagination params
    * @returns Paginated list of workers
    */
   async getWorkers(
      filters: WorkerFilters = {}
   ): Promise<PaginatedWorkersResponse> {
      try {
         const queryString = buildQueryString(filters);
         const url = `${ADMIN_ENDPOINTS.WORKERS.FILTERS}${queryString}`;

         const response = await apiClient.get<PaginatedWorkersResponse>(url);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Fetch all careers for dropdown
    * @returns List of careers
    */
   async getCareers(): Promise<Career[]> {
      try {
         const response = await apiClient.get<{ data: Career[] }>(
            ADMIN_ENDPOINTS.CAREERS.BASE
         );
         return response.data.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Fetch services with optional filtering by career and pagination
    * @param filters - Optional career filter and pagination params
    * @returns Paginated list of services
    */
   async getServices(
      filters: ServiceFilters = {}
   ): Promise<PaginatedServicesResponse> {
      try {
         const queryString = buildServicesQueryString(filters);
         const url = `${ADMIN_ENDPOINTS.SERVICES.BASE}${queryString}`;
         console.log('[API] Fetching services:', url, 'filters:', filters);

         const response = await apiClient.get<PaginatedServicesResponse>(url);
         console.log('_______________SERVICES RES _________', response.data);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Create a new service
    * @param data - Service data to create
    * @returns Created service response
    */
   async createService(data: CreateServiceRequest): Promise<ServiceResponse> {
      try {
         const response = await apiClient.post<ServiceResponse>(
            ADMIN_ENDPOINTS.SERVICES.BASE,
            data
         );
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Update service by ID
    * @param serviceId - Service ID to update
    * @param data - Service data to update
    * @returns Updated service response
    */
   async updateService(
      serviceId: number,
      data: UpdateServiceRequest
   ): Promise<ServiceResponse> {
      try {
         const url = `${ADMIN_ENDPOINTS.SERVICES.BASE}/${serviceId}`;
         const response = await apiClient.put<ServiceResponse>(url, data);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Delete service by ID
    * @param serviceId - Service ID to delete
    * @returns Delete confirmation response
    */
   async deleteService(serviceId: number): Promise<DeleteServiceResponse> {
      try {
         const url = `${ADMIN_ENDPOINTS.SERVICES.BASE}/${serviceId}`;
         const response = await apiClient.delete<DeleteServiceResponse>(url);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Fetch pending workers specifically (status = waiting)
    * Convenience method for the most common admin use case
    * @param page - Page number (1-indexed, defaults to 1)
    * @param perPage - Items per page (backend default is 10)
    * @returns Paginated list of pending workers
    */
   async getPendingWorkers(
      page: number = 1,
      perPage?: number
   ): Promise<PaginatedWorkersResponse> {
      return this.getWorkers({
         status: 'waiting' as WorkerStatus,
         page,
         perPage,
      });
   },

   /**
    * Update worker by ID
    * @param workerId - Worker ID to update
    * @param data - Worker data to update
    * @returns Updated worker response
    */
   async updateWorker(
      workerId: number,
      data: UpdateWorkerRequest
   ): Promise<UpdateWorkerResponse> {
      try {
         const url = `${ADMIN_ENDPOINTS.WORKERS.BASE}/${workerId}`;
         const response = await apiClient.put<UpdateWorkerResponse>(url, data);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Delete worker by ID
    * @param workerId - Worker ID to delete
    * @returns Delete confirmation response
    */
   async deleteWorker(workerId: number): Promise<DeleteWorkerResponse> {
      try {
         const url = `${ADMIN_ENDPOINTS.WORKERS.BASE}/${workerId}`;
         const response = await apiClient.delete<DeleteWorkerResponse>(url);
         return response.data;
      } catch (error) {
         return handleApiError(error);
      }
   },
};

export default adminApi;
