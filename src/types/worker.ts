export type WorkerStatus = 'waiting' | 'active' | 'blocked';

export interface Worker {
   id: number;
   user_id: number;
   career_id: number;
   about: string;
   status: WorkerStatus;
   years_experience: number;
   created_at: string;
   updated_at: string;
}

export interface PaginationLink {
   url: string | null;
   label: string;
   active: boolean;
}

export interface PaginatedResponse<T> {
   current_page: number;
   data: T[];
   first_page_url: string;
   from: number;
   last_page: number;
   last_page_url: string;
   links: PaginationLink[];
   next_page_url: string | null;
   path: string;
   per_page: number;
   prev_page_url: string | null;
   to: number;
   total: number;
}

export type PaginatedWorkersResponse = PaginatedResponse<Worker>;

export interface WorkerFilters {
   status?: WorkerStatus;
   page?: number;
   perPage?: number;
}
