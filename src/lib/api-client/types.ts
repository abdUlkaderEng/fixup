/**
 * Axios Types Module
 *
 * TypeScript type definitions specific to the axios client.
 */

import type { AxiosError, AxiosInstance } from 'axios';

/** Error codes that indicate network/server issues */
export type NetworkErrorCode =
   | 'ERR_NETWORK'
   | 'ECONNREFUSED'
   | 'ETIMEDOUT'
   | string;

/** Type guard to check if error is a network error */
export const isNetworkError = (error: AxiosError): boolean => {
   const networkCodes: NetworkErrorCode[] = [
      'ERR_NETWORK',
      'ECONNREFUSED',
      'ETIMEDOUT',
   ];
   return (
      !error.response || networkCodes.includes(error.code as NetworkErrorCode)
   );
};

/** Type guard to check if error has a response */
export const hasResponse = (
   error: AxiosError
): error is AxiosError & { response: NonNullable<AxiosError['response']> } => {
   return error.response !== undefined && error.response !== null;
};

/** API Client interface for dependency injection/testing */
export interface ApiClientInterface {
   client: AxiosInstance;
   setAuthToken: (token: string | null) => void;
}
