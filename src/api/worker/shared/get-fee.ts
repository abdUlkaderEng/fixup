import { get } from '@/api/admin/shared';
import { WORKER_ENDPOINTS } from './endpoints';
import type { JobFeeResponse } from '@/types/worker/wallet';

/**
 * Fetch career fee for the authenticated worker.
 * Backend: GET `WORKER_ENDPOINTS.CARRER_FEE` -> { data: { fee: number } }
 */
export async function getCareerFee(): Promise<JobFeeResponse> {
   return await get<JobFeeResponse>(WORKER_ENDPOINTS.CARRER_FEE);
}

export default getCareerFee;
