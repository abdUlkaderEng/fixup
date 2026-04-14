import { z } from 'zod';

// Unified schema with all fields (base + worker)
export const profileSchema = z.object({
   name: z
      .string()
      .min(1, 'الاسم مطلوب')
      .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل')
      .max(50, 'الاسم يجب أن لا يتجاوز 50 حرف'),
   phone: z
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
