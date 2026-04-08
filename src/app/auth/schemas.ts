import { z } from 'zod';

export const loginSchema = z.object({
   email: z
      .string()
      .min(1, 'البريد الإلكتروني مطلوب')
      .email('البريد الإلكتروني غير صالح'),
   password: z
      .string()
      .min(1, 'كلمة المرور مطلوبة')
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
   rememberMe: z.boolean().optional(),
});

export const signupSchema = z
   .object({
      fullName: z
         .string()
         .min(1, 'الاسم الكامل مطلوب')
         .min(3, 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل')
         .max(50, 'الاسم الكامل يجب أن لا يتجاوز 50 حرف'),
      email: z
         .string()
         .min(1, 'البريد الإلكتروني مطلوب')
         .email('البريد الإلكتروني غير صالح'),
      phone: z
         .string()
         .min(1, 'رقم الهاتف مطلوب')
         .regex(/^[\d\s\-\+\(\)]+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط')
         .min(10, 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل'),
      address: z
         .string()
         .min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل')
         .max(200, 'العنوان يجب أن لا يتجاوز 200 حرف')
         .optional(),
      birthDate: z
         .string()
         .optional()
         .refine((val) => {
            if (!val) return true;
            const date = new Date(val);
            const now = new Date();
            const minAge = new Date();
            minAge.setFullYear(now.getFullYear() - 120);
            const maxAge = new Date();
            maxAge.setFullYear(now.getFullYear() - 13);
            return date >= minAge && date <= maxAge;
         }, 'تاريخ الميلاد يجب أن يكون بين 13 و 120 سنة'),
      password: z
         .string()
         .min(1, 'كلمة المرور مطلوبة')
         .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
         .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل')
         .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل')
         .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
         .regex(
            /[^A-Za-z0-9]/,
            'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل'
         ),
      confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
      termsAccepted: z.boolean().refine((val) => val === true, {
         message: 'يجب الموافقة على شروط الاستخدام',
      }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'كلمات المرور غير متطابقة',
      path: ['confirmPassword'],
   });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
