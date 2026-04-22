import { AxiosError } from 'axios';
import { apiClient } from '@/lib/axios';
import { ApiError } from '@/types/auth';

// ============================================
// Error Handling
// ============================================

export class AdminApiError extends Error {
   constructor(
      message: string,
      public readonly statusCode?: number,
      public readonly originalError?: unknown
   ) {
      super(message);
      this.name = 'AdminApiError';
   }
}

export function handleApiError(error: unknown): never {
   const axiosError = error as AxiosError<ApiError>;
   const statusCode = axiosError.response?.status;

   const message =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.errors?.[
         Object.keys(axiosError.response?.data?.errors || {})[0]
      ]?.[0] ||
      'حدث خطأ أثناء تنفيذ العملية';

   throw new AdminApiError(message, statusCode, error);
}

// ============================================
// Query Builders
// ============================================

export interface PaginationParams {
   page?: number;
   perPage?: number;
}

export interface WorkerFilters extends PaginationParams {
   status?: string;
}

export interface ServiceFilters extends PaginationParams {
   career_id?: number;
}

export function buildQueryString(
   filters: Record<string, string | number | boolean | undefined>
): string {
   const params = new URLSearchParams();

   Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
         params.append(key, String(value));
      }
   });

   const query = params.toString();
   return query ? `?${query}` : '';
}

export function buildWorkerQuery(filters: WorkerFilters): string {
   return buildQueryString({
      status: filters.status,
      page: filters.page && filters.page > 1 ? filters.page : undefined,
      per_page: filters.perPage,
   });
}

export function buildServiceQuery(filters: ServiceFilters): string {
   return buildQueryString({
      career_id: filters.career_id,
      page: filters.page && filters.page > 1 ? filters.page : undefined,
      per_page: filters.perPage,
   });
}

// ============================================
// HTTP Helpers
// ============================================

export async function get<T>(url: string): Promise<T> {
   try {
      const response = await apiClient.get<T>(url);
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}

export async function post<T, D = unknown>(url: string, data: D): Promise<T> {
   try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}

export async function put<T, D = unknown>(url: string, data: D): Promise<T> {
   try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}

export async function del<T>(url: string): Promise<T> {
   try {
      const response = await apiClient.delete<T>(url);
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
}

// ============================================
// Endpoint Constants
// ============================================

export const ENDPOINTS = {
   WORKERS: {
      BASE: '/admin/worker',
   },
   SERVICES: {
      BASE: '/admin/services',
   },
   CAREERS: {
      BASE: '/admin/careers',
   },
   ADDRESSES: {
      BASE: '/admin/areas',
   },
} as const;
