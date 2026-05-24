import type { UpdateWorkerProfileRequest } from '@/types/auth';
import { appendArray } from '../shared/form-data';

export function buildUpdateWorkerProfileFormData(
   data: UpdateWorkerProfileRequest
): FormData {
   const fd = new FormData();
   fd.append('_method', 'PUT');
   fd.append('about', data.about);
   fd.append('years_experience', String(data.years_experience));
   appendArray(fd, 'services[]', data.services);
   appendArray(fd, 'images[]', data.images);
   appendArray(fd, 'delete_images[]', data.delete_images);
   return fd;
}
