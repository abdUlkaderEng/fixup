/**
 * Axios Interceptors Module
 *
 * Request and response interceptors extracted for modularity.
 * Each interceptor has a single responsibility.
 */

import type {
   AxiosInstance,
   InternalAxiosRequestConfig,
   AxiosResponse,
   AxiosError,
} from 'axios';
import { handleAxiosError } from './errors';

/** Module-level token storage (closure pattern) */
let authToken: string | null = null;

/**
 * Set the authentication token
 * Called by auth hooks when user logs in/out
 */
export const setAuthToken = (token: string | null): void => {
   authToken = token;
};

/**
 * Get current auth token
 * Useful for debugging or external access
 */
export const getAuthToken = (): string | null => authToken;

/**
 * Request interceptor - attaches Bearer token to outgoing requests
 */
const requestInterceptor = (
   config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
   if (authToken && config.headers) {
      config.headers.set('Authorization', `Bearer ${authToken}`);
   }
   return config;
};

/**
 * Response success handler - passes through successful responses
 */
const responseSuccessInterceptor = <T>(
   response: AxiosResponse<T>
): AxiosResponse<T> => {
   return response;
};

/**
 * Response error handler - processes errors and triggers redirects
 */
const responseErrorInterceptor = (error: AxiosError): Promise<never> => {
   handleAxiosError(error);
   return Promise.reject(error);
};

/**
 * Apply all interceptors to an axios instance
 * @param client - Axios instance to configure
 */
export const applyInterceptors = (client: AxiosInstance): void => {
   // Request interceptor
   client.interceptors.request.use(requestInterceptor, (error) =>
      Promise.reject(error)
   );

   // Response interceptor
   client.interceptors.response.use(
      responseSuccessInterceptor,
      responseErrorInterceptor
   );
};
