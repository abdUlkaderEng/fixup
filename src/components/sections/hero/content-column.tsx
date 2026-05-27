import { HEADLINE, STATS } from './data';

function EyebrowBadge() {
   return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 shadow-sm backdrop-blur-sm">
         <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-secondary" />
         </span>
         <span className="text-xs font-medium text-foreground/80 sm:text-sm">
            {HEADLINE.eyebrow}
         </span>
      </div>
   );
}

function Headline() {
   return (
      <h1 className="mt-6 text-4xl font-bold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
         {HEADLINE.titleStart}
         <span className="mt-2 block bg-linear-to-l from-primary to-[color-mix(in_oklch,var(--primary)_55%,var(--secondary))] bg-clip-text text-transparent">
            {HEADLINE.titleAccent}
         </span>
      </h1>
   );
}

function StatsStrip() {
   return (
      <div className="mt-5 grid max-w-md grid-cols-3 gap-15 sm:gap-14">
         {STATS.map((stat) => (
            <div key={stat.label}>
               <div className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
               </div>
               <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
               </div>
            </div>
         ))}
      </div>
   );
}

export function ContentColumn() {
   return (
      <div className="text-right">
         <EyebrowBadge />
         <Headline />
         <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HEADLINE.description}
         </p>
         <StatsStrip />
      </div>
   );
}
