import {
   BadgeCheck,
   Clock,
   Headphones,
   ShieldCheck,
   Star,
   Users,
} from 'lucide-react';

import type { ComponentType } from 'react';

export type FeatureTone =
   | 'emerald'
   | 'amber'
   | 'sky'
   | 'violet'
   | 'rose'
   | 'indigo';

export interface Feature {
   id: number;
   title: string;
   description: string;
   icon: ComponentType<{ className?: string }>;
   tone: FeatureTone;
}

export const FEATURE_TONES: Record<FeatureTone, { bg: string; text: string }> =
   {
      emerald: {
         bg: 'bg-emerald-500/12',
         text: 'text-emerald-600 dark:text-emerald-400',
      },
      amber: {
         bg: 'bg-amber-500/12',
         text: 'text-amber-600 dark:text-amber-400',
      },
      sky: { bg: 'bg-sky-500/12', text: 'text-sky-600 dark:text-sky-400' },
      violet: {
         bg: 'bg-violet-500/12',
         text: 'text-violet-600 dark:text-violet-400',
      },
      rose: { bg: 'bg-rose-500/12', text: 'text-rose-600 dark:text-rose-400' },
      indigo: {
         bg: 'bg-indigo-500/12',
         text: 'text-indigo-600 dark:text-indigo-400',
      },
   };

export const WHY_CHOOSE_US: Feature[] = [
   {
      id: 1,
      title: 'محترفون موثوقون',
      description:
         'جميع مقدمي خدماتنا خضعوا لفحص شامل وتحقق من الخلفية لراحة بالك.',
      icon: BadgeCheck,
      tone: 'emerald',
   },
   {
      id: 2,
      title: 'متاحون 24/7',
      description:
         'توفر الخدمات على مدار الساعة للإصلاحات الطارئة واحتياجات الصيانة العاجلة.',
      icon: Clock,
      tone: 'amber',
   },
   {
      id: 3,
      title: 'ضمان الرضا',
      description: 'نقف وراء عملنا بضمان شامل للرضا على جميع الخدمات.',
      icon: ShieldCheck,
      tone: 'sky',
   },
   {
      id: 4,
      title: 'شبكة خبراء',
      description:
         'الوصول إلى شبكة كبيرة من المحترفين ذوي الخبرة مع سجلات مثبتة.',
      icon: Users,
      tone: 'violet',
   },
   {
      id: 5,
      title: 'تسعير شفاف',
      description: 'تسعير واضح ومقدم مع عدم وجود رسوم خفية أو تكاليف مفاجئة.',
      icon: Star,
      tone: 'rose',
   },
   {
      id: 6,
      title: 'استجابة سريعة',
      description:
         'أوقات استجابة سريعة مع معظم طلبات الخدمات يتم الرد عليها خلال ساعات.',
      icon: Headphones,
      tone: 'indigo',
   },
];

export interface FooterLinkItem {
   label: string;
   href: string;
}

export const QUICK_LINKS: FooterLinkItem[] = [
   { label: 'الرئيسية', href: '/' },
   { label: 'الخدمات', href: '/#services' },
   { label: 'إنشاء طلب', href: '/customer/orders/create' },
   { label: 'طلباتي', href: '/customer/orders' },
];

export const LEGAL_LINKS: FooterLinkItem[] = [
   { label: 'سياسة الخصوصية', href: '#' },
   { label: 'شروط الخدمة', href: '#' },
];

export type SocialName = 'facebook' | 'twitter' | 'instagram' | 'whatsapp';

export const SOCIAL_PATHS: Record<SocialName, string> = {
   facebook:
      'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
   twitter:
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
   instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
   whatsapp:
      'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
};

export interface SocialLink {
   label: string;
   href: string;
   name: SocialName;
}

export const SOCIAL_LINKS: SocialLink[] = [
   { label: 'Facebook', href: '#', name: 'facebook' },
   { label: 'Twitter', href: '#', name: 'twitter' },
   { label: 'Instagram', href: '#', name: 'instagram' },
   { label: 'WhatsApp', href: '#', name: 'whatsapp' },
];

export const CONTACT = {
   phoneDisplay: '1-800-FIXUP-NOW',
   phoneTel: '18003498796',
   email: 'support@fixup.com',
   area: 'نخدم جميع المدن الرئيسية',
} as const;

export const BRAND = {
   name: 'FIXUP',
   tagline:
      'منصة فيكس أب تجمع بين أصحاب المنازل وأمهر الفنيين المعتمدين لتوفير خدمات صيانة وإصلاح موثوقة وبأسعار شفافة.',
} as const;
