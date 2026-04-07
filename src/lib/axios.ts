import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL =
   process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
   private static instance: ApiClient;
   public readonly client: AxiosInstance;

   private constructor() {
      this.client = axios.create({
         baseURL: API_BASE_URL,
         headers: {
            'Content-Type': 'application/json',
         },
         timeout: 10000,
         withCredentials: true,
      });

      this.setupInterceptors();
   }

   public static getInstance(): ApiClient {
      if (!ApiClient.instance) {
         ApiClient.instance = new ApiClient();
      }
      return ApiClient.instance;
   }

   private setupInterceptors(): void {
      this.client.interceptors.response.use(
         (response) => response,
         (error: AxiosError) => {
            if (error.response?.status === 401) {
               window.location.href = '/auth/login';
            }
            return Promise.reject(error);
         }
      );
   }
}

export const apiClient = ApiClient.getInstance().client;
export default apiClient;
