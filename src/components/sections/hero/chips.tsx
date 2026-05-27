import type { ComponentType } from 'react';

interface OrbitChipProps {
   icon: ComponentType<{ className?: string }>;
   label: string;
   /** Tailwind class string applied to the icon swatch (bg + text). */
   tone: string;
}

/** Small pill with icon + label that floats around the hero visual. */
export function OrbitChip({ icon: Icon, label, tone }: OrbitChipProps) {
   return (
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
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
}

/** Stationary card chip used for trust signals next to the product preview. */
export function TrustChip({
   icon: Icon,
   iconClass,
   tone,
   smallLabel,
   bigLabel,
}: TrustChipProps) {
   return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
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
