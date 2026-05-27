import { FEATURE_TONES, WHY_CHOOSE_US, type Feature } from './data';

function FeatureCard({ icon: Icon, title, description, tone }: Feature) {
   const tc = FEATURE_TONES[tone];
   return (
      <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-6">
         {/* Hover glow */}
         <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-primary/6 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

         <div
            className={`relative flex size-12 shrink-0 items-center justify-center rounded-xl ${tc.bg}`}
         >
            <Icon className={`size-6 ${tc.text}`} />
         </div>

         <div className="relative flex-1">
            <h3 className="text-base font-bold text-foreground sm:text-lg">
               {title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
               {description}
            </p>
         </div>
      </div>
   );
}

export function WhyChooseUs() {
   return (
      <section className="relative overflow-hidden bg-background py-20 sm:py-24">
         {/* Soft background accent */}
         <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
               backgroundImage:
                  'radial-gradient(700px 360px at 50% 0%, color-mix(in oklch, var(--secondary) 8%, transparent), transparent 70%)',
            }}
         />

         <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mx-auto max-w-2xl text-center">
               <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-secondary" />
                  <span className="text-xs font-medium text-foreground/80 sm:text-sm">
                     لماذا فيكس أب
                  </span>
               </div>

               <h2 className="mt-5 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                  مزايا تجعلنا{' '}
                  <span className="bg-linear-to-l from-primary to-[color-mix(in_oklch,var(--primary)_55%,var(--secondary))] bg-clip-text text-transparent">
                     خيارك الأول
                  </span>
               </h2>

               <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                  نحن ملتزمون بتقديم خدمات منزلية استثنائية مع الموثوقية والجودة
                  ورضا العملاء في صميم كل ما نقوم به.
               </p>
            </div>

            {/* Features grid */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
               {WHY_CHOOSE_US.map((item) => (
                  <FeatureCard key={item.id} {...item} />
               ))}
            </div>
         </div>
      </section>
   );
}
