import { z } from 'zod';

export const profileSchema = z.object({
   name: z
      .string()
      .min(1, 'الاسم مطلوب')
      .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
      .max(50, 'الاسم يجب أن لا يتجاوز 50 حرف'),
   phone_number: z
      .string()
      .min(1, 'رقم الهاتف مطلوب')
      .regex(/^\d+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط')
      .min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
   address: z
      .string()
      .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
      .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف')
      .optional()
      .or(z.literal('')),
   birth_date: z.string().optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
