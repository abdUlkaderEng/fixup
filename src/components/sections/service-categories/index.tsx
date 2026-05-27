import { CareerGrid } from './career-grid';

function SectionHeader() {
   return (
      <div className="mx-auto max-w-2xl text-center">
         <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium text-foreground/80 sm:text-sm">
               تصنيفات الخدمات
            </span>
         </div>

         <h2 className="mt-5 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            استعراض المهن{' '}
            <span className="bg-linear-to-l from-primary to-[color-mix(in_oklch,var(--primary)_55%,var(--secondary))] bg-clip-text text-transparent">
               المتوفرة
            </span>
         </h2>

         <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            اعثر على الفني المثالي لاحتياجات منزلك واطلب الخدمة بضغطة واحدة
         </p>
      </div>
   );
}

function BackgroundAccent() {
   return (
      <div
         aria-hidden
         className="pointer-events-none absolute inset-0 -z-10 opacity-60"
         style={{
            backgroundImage:
               'radial-gradient(600px 320px at 50% 0%, color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)',
         }}
      />
   );
}

export function ServiceCategories() {
   return (
      <section
         id="services"
         dir="rtl"
         className="relative scroll-mt-20 overflow-hidden bg-background py-20 sm:py-24"
      >
         <BackgroundAccent />

         <div className="container mx-auto px-4">
            <SectionHeader />
            <CareerGrid />
         </div>
      </section>
   );
}
