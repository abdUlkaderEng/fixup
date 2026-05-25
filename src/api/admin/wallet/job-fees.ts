import { apiClient } from '@/lib/axios';
import { post, put, handleApiError } from '../shared';
import { WALLET_ENDPOINTS } from './endpoints';
import type {
   CreateJobFeeRequest,
   UpdateJobFeeRequest,
   JobFeeResponse,
   JobFee,
} from '@/types/admin/wallet';

/**
 * Job Fees API
 * Manages per-career fees that workers pay to accept a job.
 *
 * Backend currently exposes only POST/PUT. The optimistic `getAll()` below
 * tolerates both `JobFee[]` and `{ data: JobFee[] }` shapes so it lights up
 * automatically once the GET endpoint ships.
 */
export const jobFeesApi = {
   /**
    * Fetch all job fees.
    *
    * TODO(backend): no list endpoint exists yet. This call will currently
    * fail with 404; the UI falls back to per-career local state when so.
    */
   async getAll(): Promise<JobFee[]> {
      try {
         const response = await apiClient.get<{ data?: JobFee[] } | JobFee[]>(
            WALLET_ENDPOINTS.JOB_FEES
         );
         const payload = response.data;
         if (Array.isArray(payload)) return payload;
         return payload?.data ?? [];
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Create a job fee for a career.
    */
   async create(data: CreateJobFeeRequest): Promise<JobFeeResponse> {
      return await post<JobFeeResponse, CreateJobFeeRequest>(
         WALLET_ENDPOINTS.JOB_FEES,
         data
      );
   },

   /**
    * Update the job fee for a career.
    */
   async update(
      careerId: number,
      data: UpdateJobFeeRequest
   ): Promise<JobFeeResponse> {
      return await put<JobFeeResponse, UpdateJobFeeRequest>(
         WALLET_ENDPOINTS.JOB_FEE_BY_CAREER(careerId),
         data
      );
   },
} as const;

export default jobFeesApi;
