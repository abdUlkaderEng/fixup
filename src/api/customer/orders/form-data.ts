import type { CreateOrderRequest } from '@/types/entities/order';

export function buildCreateOrderFormData(data: CreateOrderRequest): FormData {
   const formData = new FormData();

   formData.append('description', data.description);
   formData.append('scheduled_at', data.scheduled_at);
   formData.append('priority', data.priority ? '1' : '0');
   formData.append('career_id', String(data.career_id));

   data.services.forEach((serviceId) => {
      formData.append('services[]', String(serviceId));
   });

   formData.append('address[latitude]', String(data.address.latitude));
   formData.append('address[longitude]', String(data.address.longitude));
   formData.append('address[detailed_address]', data.address.detailed_address);
   formData.append(
      'address[area_address_id]',
      String(data.address.area_address_id)
   );

   data.images.forEach((file) => {
      formData.append('images[]', file);
   });

   return formData;
}
