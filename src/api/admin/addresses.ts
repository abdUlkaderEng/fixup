import { get, post, del, ENDPOINTS } from './shared';
import type {
   Address,
   CreateAddressRequest,
   CreateAddressResponse,
   DeleteAddressResponse,
   GetAddressesResponse,
} from '@/types/address';

/**
 * Address API Module
 * Handles CRUD operations for addresses (areas)
 */

export const addressesApi = {
   /**
    * Fetch all addresses/areas
    */
   async getAll(): Promise<GetAddressesResponse> {
      return await get<GetAddressesResponse>(ENDPOINTS.ADDRESSES.BASE);
   },

   /**
    * Fetch all addresses as a flat array
    */
   async getList(): Promise<Address[]> {
      const response = await get<GetAddressesResponse>(
         ENDPOINTS.ADDRESSES.BASE
      );
      return response.data ?? [];
   },

   /**
    * Create a new address/area
    */
   async create(data: CreateAddressRequest): Promise<CreateAddressResponse> {
      return await post<CreateAddressResponse, CreateAddressRequest>(
         ENDPOINTS.ADDRESSES.BASE,
         data
      );
   },

   /**
    * Delete address by ID
    */
   async delete(addressId: number): Promise<DeleteAddressResponse> {
      const url = `${ENDPOINTS.ADDRESSES.BASE}/${addressId}`;
      return await del<DeleteAddressResponse>(url);
   },
} as const;

export default addressesApi;
