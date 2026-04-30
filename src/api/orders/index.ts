import { post } from '@/api/admin/shared';
import type {
   CreateOrderRequest,
   CreateOrderResponse,
} from '@/types/entities/order';

export const ordersApi = {
   async create(data: CreateOrderRequest): Promise<CreateOrderResponse> {
      return await post<CreateOrderResponse, CreateOrderRequest>(
         '/order',
         data
      );
   },
} as const;

export default ordersApi;
