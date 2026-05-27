import { OrbitChip, TrustChip } from './chips';
import { ORBIT_SERVICES, TRUST_CHIPS } from './data';
import { OrderCard } from './order-card';

function DecorativeBackdrop() {
   return (
      <>
         {/* Glow blobs */}
         <div className="absolute size-105 rounded-full bg-primary/10 blur-3xl" />
         <div className="absolute size-65 -translate-y-20 translate-x-24 rounded-full bg-secondary/20 blur-2xl" />

         {/* Decorative orbit rings */}
         <div className="absolute size-110 rounded-full border border-border/60" />
         <div className="absolute size-85 rounded-full border border-border/40" />
      </>
   );
}

function OrbitChips() {
   return (
      <>
         {ORBIT_SERVICES.map((service) => (
            <div
               key={service.label}
               className={`absolute z-20 will-change-transform ${service.position} ${service.animation}`}
               style={{ animationDelay: `${service.delaySeconds}s` }}
            >
               <OrbitChip
                  icon={service.icon}
                  label={service.label}
                  tone={service.tone}
               />
            </div>
         ))}
      </>
   );
}

function TrustChips() {
   return (
      <>
         {TRUST_CHIPS.map(({ position, animation, delaySeconds, ...chip }) => (
            <div key={chip.smallLabel} className={`absolute z-30 ${position}`}>
               <div
                  className={`will-change-transform ${animation}`}
                  style={{ animationDelay: `${delaySeconds}s` }}
               >
                  <TrustChip {...chip} />
               </div>
            </div>
         ))}
      </>
   );
}

export function PreviewColumn() {
   return (
      <div className="relative mx-auto hidden h-140 w-full max-w-130 items-center justify-center lg:flex">
         <DecorativeBackdrop />
         <OrbitChips />
         <OrderCard />
         <TrustChips />
      </div>
   );
}
