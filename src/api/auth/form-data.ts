import type { RegisterWorkerRequest } from '@/types/auth';
import { appendArray } from '@/api/worker/shared';

export function buildRegisterWorkerFormData(
   data: RegisterWorkerRequest
): FormData {
   const fd = new FormData();
   fd.append('career_id', String(data.career_id));
   fd.append('about', data.about);
   fd.append('years_experience', String(data.years_experience));
   appendArray(fd, 'services[]', data.services);
   appendArray(fd, 'images[]', data.images);
   return fd;
}
