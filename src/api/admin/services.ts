import { get, post, put, del, buildServiceQuery, ENDPOINTS } from './shared';
import type {
   ServiceFilters,
   PaginatedServicesResponse,
   CreateServiceRequest,
   UpdateServiceRequest,
   ServiceResponse,
   DeleteServiceResponse,
} from '@/types/admin/services';

/**
 * Service API Module
 * Handles CRUD operations for services with pagination
 */

export const servicesApi = {
   /**
    * Fetch services with optional filtering by career and pagination
    */
   async getAll(
      filters: ServiceFilters = {}
   ): Promise<PaginatedServicesResponse> {
      const queryString = buildServiceQuery(filters);
      const url = `${ENDPOINTS.SERVICES.BASE}${queryString}`;
      return await get<PaginatedServicesResponse>(url);
   },

   /**
    * Create a new service
    */
   async create(data: CreateServiceRequest): Promise<ServiceResponse> {
      return await post<ServiceResponse, CreateServiceRequest>(
         ENDPOINTS.SERVICES.BASE,
         data
      );
   },

   /**
    * Update service by ID
    */
   async update(
      serviceId: number,
      data: UpdateServiceRequest
   ): Promise<ServiceResponse> {
      const url = `${ENDPOINTS.SERVICES.BASE}/${serviceId}`;
      return await put<ServiceResponse, UpdateServiceRequest>(url, data);
   },

   /**
    * Delete service by ID
    */
   async delete(serviceId: number): Promise<DeleteServiceResponse> {
      const url = `${ENDPOINTS.SERVICES.BASE}/${serviceId}`;
      return await del<DeleteServiceResponse>(url);
   },
} as const;

export default servicesApi;
