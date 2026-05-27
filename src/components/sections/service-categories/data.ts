import {
   Droplets,
   Frame,
   Hammer,
   Layers,
   LayoutGrid,
   Lightbulb,
   PaintBucket,
   Paintbrush,
   Sparkles,
   Trees,
   Truck,
   Wind,
   Wrench,
   Zap,
} from 'lucide-react';
import type { ComponentType } from 'react';

/** All tonal styles supported by career cards. */
export type Tone =
   | 'amber'
   | 'sky'
   | 'cyan'
   | 'rose'
   | 'violet'
   | 'emerald'
   | 'blue'
   | 'orange'
   | 'fuchsia'
   | 'indigo'
   | 'slate';

export interface ToneClasses {
   bg: string;
   text: string;
   ring: string;
}

export const TONE_CLASSES: Record<Tone, ToneClasses> = {
   amber: {
      bg: 'bg-amber-500/12',
      text: 'text-amber-600 dark:text-amber-400',
      ring: 'group-hover:ring-amber-500/30',
   },
   sky: {
      bg: 'bg-sky-500/12',
      text: 'text-sky-600 dark:text-sky-400',
      ring: 'group-hover:ring-sky-500/30',
   },
   cyan: {
      bg: 'bg-cyan-500/12',
      text: 'text-cyan-600 dark:text-cyan-400',
      ring: 'group-hover:ring-cyan-500/30',
   },
   rose: {
      bg: 'bg-rose-500/12',
      text: 'text-rose-600 dark:text-rose-400',
      ring: 'group-hover:ring-rose-500/30',
   },
   violet: {
      bg: 'bg-violet-500/12',
      text: 'text-violet-600 dark:text-violet-400',
      ring: 'group-hover:ring-violet-500/30',
   },
   emerald: {
      bg: 'bg-emerald-500/12',
      text: 'text-emerald-600 dark:text-emerald-400',
      ring: 'group-hover:ring-emerald-500/30',
   },
   blue: {
      bg: 'bg-blue-500/12',
      text: 'text-blue-600 dark:text-blue-400',
      ring: 'group-hover:ring-blue-500/30',
   },
   orange: {
      bg: 'bg-orange-500/12',
      text: 'text-orange-600 dark:text-orange-400',
      ring: 'group-hover:ring-orange-500/30',
   },
   fuchsia: {
      bg: 'bg-fuchsia-500/12',
      text: 'text-fuchsia-600 dark:text-fuchsia-400',
      ring: 'group-hover:ring-fuchsia-500/30',
   },
   indigo: {
      bg: 'bg-indigo-500/12',
      text: 'text-indigo-600 dark:text-indigo-400',
      ring: 'group-hover:ring-indigo-500/30',
   },
   slate: {
      bg: 'bg-slate-500/12',
      text: 'text-slate-600 dark:text-slate-400',
      ring: 'group-hover:ring-slate-500/30',
   },
};

type IconComponent = ComponentType<{ className?: string }>;

export interface IconRule {
   keywords: string[];
   icon: IconComponent;
   tone: Tone;
}

/** Arabic keyword → icon/tone mapping. First matching rule wins. */
export const ICON_RULES: IconRule[] = [
   { keywords: ['كهرباء', 'إنارة', 'انارة'], icon: Zap, tone: 'amber' },
   { keywords: ['سباكة', 'صحية', 'مياه'], icon: Droplets, tone: 'sky' },
   { keywords: ['تكييف', 'تبريد'], icon: Wind, tone: 'cyan' },
   { keywords: ['نجارة', 'خشب', 'أثاث'], icon: Hammer, tone: 'rose' },
   { keywords: ['دهان', 'دهانات'], icon: Paintbrush, tone: 'violet' },
   { keywords: ['تنظيف'], icon: Sparkles, tone: 'emerald' },
   { keywords: ['ألمنيوم', 'المنيوم'], icon: Frame, tone: 'slate' },
   { keywords: ['زجاج'], icon: LayoutGrid, tone: 'blue' },
   { keywords: ['بلاط', 'تبليط', 'سيراميك'], icon: Layers, tone: 'orange' },
   { keywords: ['جبس'], icon: PaintBucket, tone: 'fuchsia' },
   { keywords: ['نقل', 'شحن'], icon: Truck, tone: 'indigo' },
   { keywords: ['حدائق', 'بستنة', 'زراعة'], icon: Trees, tone: 'emerald' },
   { keywords: ['مصابيح'], icon: Lightbulb, tone: 'amber' },
];

/** Tones used cyclically for careers that don't match any keyword rule. */
export const FALLBACK_TONES: Tone[] = [
   'amber',
   'sky',
   'rose',
   'violet',
   'emerald',
   'orange',
   'indigo',
   'fuchsia',
];

export const FALLBACK_ICON: IconComponent = Wrench;

export interface ResolvedCareer {
   icon: IconComponent;
   tone: Tone;
}

/** Picks an icon + tone for a career name, falling back by index when unmatched. */
export function resolveCareer(name: string, index: number): ResolvedCareer {
   const match = ICON_RULES.find((rule) =>
      rule.keywords.some((keyword) => name.includes(keyword))
   );
   if (match) return { icon: match.icon, tone: match.tone };
   return {
      icon: FALLBACK_ICON,
      tone: FALLBACK_TONES[index % FALLBACK_TONES.length],
   };
}
