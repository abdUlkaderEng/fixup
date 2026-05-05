import { get, post } from '@/api/admin/shared';
import type {
   CustomerOrder,
   CustomerOrdersResponse,
   CreateOrderRequest,
   CreateOrderResponse,
} from '@/types/entities/order';

const CREATE_ORDER_ENDPOINT = '/order' as const;
const CUSTOMER_ORDERS_ENDPOINT = '/costmer-orders' as const;

export const ordersApi = {
   async getAll(): Promise<CustomerOrder[]> {
      const response = await get<CustomerOrdersResponse | CustomerOrder[]>(
         CUSTOMER_ORDERS_ENDPOINT
      );

      return Array.isArray(response) ? response : response.data;
   },

   async create(data: CreateOrderRequest): Promise<CreateOrderResponse> {
      return await post<CreateOrderResponse, CreateOrderRequest>(
         CREATE_ORDER_ENDPOINT,
         data
      );
   },
} as const;

export default ordersApi;
