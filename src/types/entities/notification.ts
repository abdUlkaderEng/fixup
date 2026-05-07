export interface WorkerNotification {
   id: number;
   user_id: number;
   title: string;
   body: string;
   type: string;
   data: Record<string, unknown>;
   is_read: boolean;
   created_at: string;
   updated_at: string;
}
