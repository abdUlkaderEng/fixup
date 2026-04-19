import { z } from 'zod';

// Unified schema with all fields (base + worker)
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
   latitude: z
      .number()
      .min(-90)
      .max(90, 'خط العرض يجب أن يكون بين -90 و 90')
      .optional(),
   longitude: z
      .number()
      .min(-180)
      .max(180, 'خط الطول يجب أن يكون بين -180 و 180')
      .optional(),
   detailed_address: z
      .string()
      .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
      .max(500, 'العنوان يجب أن لا يتجاوز 500 حرف')
      .optional()
      .or(z.literal('')),
   area_address_id: z.number().min(1, 'معرف المنطقة مطلوب').optional(),
   birth_date: z.string().optional().or(z.literal('')),
   // Worker fields (optional for all)
   about: z
      .string()
      .min(10, 'نبذة عن الفني يجب أن تكون 10 أحرف على الأقل')
      .max(500, 'نبذة عن الفني يجب أن لا تتجاوز 500 حرف')
      .optional()
      .or(z.literal('')),
   nearly_date: z.string().optional().or(z.literal('')),
   years_experience: z
      .string()
      .regex(/^\d*$/, 'سنوات الخبرة يجب أن تكون أرقام فقط')
      .optional()
      .or(z.literal('')),
   account_status: z.enum(['active', 'pending', 'suspended']).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Alias for backward compatibility
export type UnifiedProfileFormData = ProfileFormData;
