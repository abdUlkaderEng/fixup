import { ContentColumn } from './content-column';
import { PreviewColumn } from './preview-column';

function BackdropLayers() {
   return (
      <>
         {/* Theme-aware radial accents */}
         <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
               backgroundImage:
                  'radial-gradient(900px 520px at 88% 8%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%), radial-gradient(700px 520px at 8% 92%, color-mix(in oklch, var(--secondary) 22%, transparent), transparent 60%)',
            }}
         />

         {/* Subtle grid */}
         <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.08]"
            style={{
               backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
               backgroundSize: '48px 48px',
               maskImage:
                  'radial-gradient(ellipse at center, black 35%, transparent 78%)',
            }}
         />
      </>
   );
}

function BottomFade() {
   return (
      <div
         aria-hidden
         className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-background"
      />
   );
}

export function Hero() {
   return (
      <section
         dir="rtl"
         className="relative isolate overflow-hidden bg-background pt-15"
      >
         <BackdropLayers />

         <div className="container relative mx-auto px-4 pb-16 pt-5 lg:pb-20 lg:pt-3">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
               <ContentColumn />
               <PreviewColumn />
            </div>
         </div>

         <BottomFade />
      </section>
   );
}
