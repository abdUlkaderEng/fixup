import {
   Droplets,
   Hammer,
   Paintbrush,
   ShieldCheck,
   Star,
   Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ className?: string }>;

export interface Stat {
   value: string;
   label: string;
}

export const STATS: Stat[] = [
   { value: '+500', label: 'عميل' },
   { value: '+50', label: 'فني معتمد' },
   { value: '24/7', label: 'دعم متواصل' },
];

/** Orbit animation classes defined in globals.css. */
export type OrbitAnimation = 'hero-orbit-cw' | 'hero-orbit-ccw';

export interface OrbitService {
   icon: IconComponent;
   label: string;
   /** Tailwind class string for the icon swatch (bg + text). */
   tone: string;
   /** Tailwind positioning utilities relative to the visual column. */
   position: string;
   animation: OrbitAnimation;
   /** Seconds. Staggers chips so they don't all move in sync. */
   delaySeconds: number;
}

export const ORBIT_SERVICES: OrbitService[] = [
   {
      icon: Zap,
      label: 'كهرباء',
      tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      position: 'top-5 right-8',
      animation: 'hero-orbit-cw',
      delaySeconds: 0,
   },
   {
      icon: Droplets,
      label: 'تكييف',
      tone: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
      position: 'bottom-15 right-2',
      animation: 'hero-orbit-ccw',
      delaySeconds: 1.5,
   },
   {
      icon: Paintbrush,
      label: 'صحية',
      tone: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
      position: 'top-9 left-8',
      animation: 'hero-orbit-ccw',
      delaySeconds: 0.8,
   },
   {
      icon: Hammer,
      label: 'نجارة',
      tone: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      position: 'bottom-12 left-2',
      animation: 'hero-orbit-cw',
      delaySeconds: 2.2,
   },
];

export interface TrustChipConfig {
   icon: IconComponent;
   /** Extra Tailwind classes applied to the icon itself (color/fill). */
   iconClass: string;
   /** Tailwind class for the icon swatch background. */
   tone: string;
   smallLabel: string;
   bigLabel: string;
   /** Tailwind positioning utilities relative to the visual column. */
   position: string;
   /** Animation class defined in globals.css. */
   animation: 'hero-float';
   /** Seconds. Staggers chips so they don't bob in sync. */
   delaySeconds: number;
}

export const TRUST_CHIPS: TrustChipConfig[] = [
   {
      icon: ShieldCheck,
      iconClass: 'text-primary',
      tone: 'bg-primary/10',
      smallLabel: 'فنيون',
      bigLabel: 'معتمدون',
      position: '-right-4 top-1/2 -translate-y-[140%]',
      animation: 'hero-float',
      delaySeconds: 0.4,
   },
   {
      icon: Star,
      iconClass: 'fill-secondary text-secondary-foreground',
      tone: 'bg-secondary/20',
      smallLabel: 'تقييم العملاء',
      bigLabel: '4.9 / 5',
      position: '-left-4 top-1/2 translate-y-[115%]',
      animation: 'hero-float',
      delaySeconds: 1.6,
   },
];

/** Mock "live order" data shown inside the hero product preview card. */
export const MOCK_ORDER = {
   status: 'فني في الطريق',
   workerName: 'عبدالقادر بقدونس',
   workerSubtitle: '4.9 · فني كهرباء',
   service: 'تركيب وحدة إنارة',
   location: 'حي البرامكة',
   eta: 'خلال 25 دقيقة',
   progressPct: 68,
   confirmation: 'تم تأكيد السعر ودفع آمن',
} as const;

export const HEADLINE = {
   eyebrow: 'منصة الخدمات المنزلية الموثوقة',
   titleStart: 'خدمات منزلية موثوقة',
   titleAccent: 'بين يديك',
   description:
      'فريق محترفين جاهز لتنفيذ أعمال الصيانة والإصلاح بخبرة دقيقة وجودة عالية. من الكهرباء والسباكة إلى التحسينات المنزلية، نساعدك تحصل على خدمة سريعة وآمنة وبأسعار واضحة.',
} as const;
