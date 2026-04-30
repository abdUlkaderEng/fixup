import { z } from 'zod';

export const createOrderSchema = z.object({
   description: z
      .string()
      .min(10, 'يرجى كتابة وصف مفصل للطلب (10 أحرف على الأقل)'),
   priority: z.enum(['normal', 'urgent']),
   areaAddressId: z.number().min(1, 'يرجى اختيار المنطقة'),
   detailedAddress: z.string().min(5, 'يرجى كتابة عنوان تفصيلي واضح'),
   latitude: z.number(),
   longitude: z.number(),
   images: z.array(z.any()),
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
