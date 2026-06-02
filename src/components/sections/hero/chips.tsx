import type { ComponentType, CSSProperties } from 'react';

import type { OrbitAnimation } from './data';

interface OrbitChipProps {
   icon: ComponentType<{ className?: string }>;
   label: string;
   /** Tailwind class string applied to the icon swatch (bg + text). */
   tone: string;
   /** Animation class defined in globals.css. */
   animation: OrbitAnimation;
   /** Seconds. Staggers chips so they don't move in sync. */
   delaySeconds: number;
}

/** Small pill with icon + label that floats around the hero visual. */
export function OrbitChip({
   icon: Icon,
   label,
   tone,
   animation,
   delaySeconds,
}: OrbitChipProps) {
   const style: CSSProperties = { animationDelay: `${delaySeconds}s` };
   return (
      <div
         className={`flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 shadow-md backdrop-blur-sm will-change-transform ${animation}`}
         style={style}
      >
         <div
            className={`flex size-7 items-center justify-center rounded-full ${tone}`}
         >
            <Icon className="size-3.5" />
         </div>
         <span className="text-xs font-semibold text-foreground">{label}</span>
      </div>
   );
}

interface TrustChipProps {
   icon: ComponentType<{ className?: string }>;
   iconClass: string;
   tone: string;
   smallLabel: string;
   bigLabel: string;
   /** Animation class defined in globals.css. */
   animation: 'hero-float';
   /** Seconds. Staggers chips so they don't bob in sync. */
   delaySeconds: number;
}

/** Card chip used for trust signals next to the product preview. */
export function TrustChip({
   icon: Icon,
   iconClass,
   tone,
   smallLabel,
   bigLabel,
   animation,
   delaySeconds,
}: TrustChipProps) {
   const style: CSSProperties = { animationDelay: `${delaySeconds}s` };
   return (
      <div
         className={`flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl will-change-transform ${animation}`}
         style={style}
      >
         <div
            className={`flex size-9 items-center justify-center rounded-xl ${tone}`}
         >
            <Icon className={`size-4 ${iconClass}`} />
         </div>
         <div className="text-right">
            <div className="text-[10px] text-muted-foreground">
               {smallLabel}
            </div>
            <div className="text-xs font-bold text-foreground">{bigLabel}</div>
         </div>
      </div>
   );
}
