import { get, post, del, ENDPOINTS } from './shared';
import type {
   Career,
   CreateCareerRequest,
   CareerResponse,
   DeleteCareerResponse,
   GetCareersResponse,
} from '@/types/service';

/**
 * Career API Module
 * Handles CRUD operations for careers
 */

export const careersApi = {
   /**
    * Fetch all careers for dropdown (returns only data array)
    */
   async getAll(): Promise<Career[]> {
      const response = await get<{ data: Career[] }>(ENDPOINTS.CAREERS.BASE);
      return response.data;
   },

   /**
    * Fetch all careers with full response including timestamps
    */
   async getList(): Promise<GetCareersResponse> {
      return await get<GetCareersResponse>(ENDPOINTS.CAREERS.BASE);
   },

   /**
    * Create a new career
    */
   async create(data: CreateCareerRequest): Promise<CareerResponse> {
      return await post<CareerResponse, CreateCareerRequest>(
         ENDPOINTS.CAREERS.BASE,
         data
      );
   },

   /**
    * Delete career by ID
    */
   async delete(careerId: number): Promise<DeleteCareerResponse> {
      const url = `${ENDPOINTS.CAREERS.BASE}/${careerId}`;
      return await del<DeleteCareerResponse>(url);
   },
} as const;

export default careersApi;
