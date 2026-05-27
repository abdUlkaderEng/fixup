import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ComponentType } from 'react';

import { TONE_CLASSES, type Tone } from './data';

export interface CareerCardProps {
   id: number;
   name: string;
   icon: ComponentType<{ className?: string }>;
   tone: Tone;
}

export function CareerCard({ id, name, icon: Icon, tone }: CareerCardProps) {
   const tc = TONE_CLASSES[tone];
   const href = `/customer/orders/create?careerId=${id}&careerName=${encodeURIComponent(name)}`;

   return (
      <Link
         href={href}
         className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
         {/* Hover glow */}
         <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/6 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

         {/* Icon */}
         <div
            className={`relative flex size-12 items-center justify-center rounded-xl ring-1 ring-transparent transition-all duration-300 ${tc.bg} ${tc.ring}`}
         >
            <Icon className={`size-6 ${tc.text}`} />
         </div>

         {/* Title */}
         <h3 className="relative mt-4 text-lg font-bold text-foreground">
            {name}
         </h3>

         {/* Description */}
         <p className="relative mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            خدمات {name} احترافية بأيدي فنيين معتمدين وبأسعار واضحة
         </p>

         {/* Divider */}
         <div className="relative mt-5 h-px bg-border" />

         {/* CTA row */}
         <div className="relative mt-4 inline-flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
               احجز الآن
               <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
               <span className="size-1.5 rounded-full bg-emerald-500" />
               متاح الآن
            </span>
         </div>
      </Link>
   );
}
