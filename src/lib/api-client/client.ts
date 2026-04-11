/**
 * Axios Client Module
 *
 * Factory function to create configured axios instances.
 * Replaces class-based singleton with functional approach.
 */

import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, AXIOS_CONFIG } from './config';
import { applyInterceptors, setAuthToken } from './interceptors';
import type { ApiClientInterface } from './types';

/**
 * Create a configured axios instance
 * @returns AxiosInstance with interceptors applied
 */
const createAxiosInstance = (): AxiosInstance => {
   const client = axios.create({
      baseURL: API_BASE_URL,
      ...AXIOS_CONFIG,
   });

   applyInterceptors(client);

   return client;
};

/**
 * Create the API client singleton
 * Using module-level singleton (simpler than class-based)
 */
const createApiClient = (): ApiClientInterface => {
   const client = createAxiosInstance();

   return {
      client,
      setAuthToken,
   };
};

// Singleton instance - created once on module import
const apiClientInstance = createApiClient();

/** Pre-configured axios instance for API calls */
export const apiClient = apiClientInstance.client;

/** Export setAuthToken for external use */
export { setAuthToken };

/** Default export for convenience */
export default apiClient;
