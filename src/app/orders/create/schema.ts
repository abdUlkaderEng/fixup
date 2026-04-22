import { z } from 'zod';

export const createOrderSchema = z.object({
   description: z
      .string()
      .min(10, 'يرجى كتابة وصف مفصل للطلب (10 أحرف على الأقل)'),
   priority: z.enum(['normal', 'urgent']),
   budgetTier: z.enum(['economic', 'vip']),
   areaAddressId: z.coerce.number().min(1, 'يرجى اختيار المنطقة'),
   detailedAddress: z.string().min(5, 'يرجى كتابة عنوان تفصيلي واضح'),
   latitude: z.number(),
   longitude: z.number(),
   image: z.any().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

export const priorityOptions = [
   {
      value: 'normal',
      title: 'عادية',
      description: 'تنفيذ ضمن المدة القياسية',
   },
   {
      value: 'urgent',
      title: 'مستعجلة',
      description: 'أولوية أعلى للتنفيذ السريع',
   },
] as const;

export const budgetTierOptions = [
   {
      value: 'economic',
      title: 'اقتصادي',
      description: 'حلول مناسبة وبتكلفة أقل',
   },
   {
      value: 'vip',
      title: 'VIP',
      description: 'خدمة مميزة مع أفضل الخيارات',
   },
] as const;
