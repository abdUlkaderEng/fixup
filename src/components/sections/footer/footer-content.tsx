import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import { BRAND, CONTACT, LEGAL_LINKS, QUICK_LINKS, SOCIAL_LINKS } from './data';
import { NewsletterForm } from './newsletter-form';
import {
   ContactItem,
   FooterLinkColumn,
   FooterSectionHeading,
   SocialButton,
} from './parts';

function BrandColumn() {
   return (
      <div className="lg:col-span-5">
         <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-secondary to-amber-500 text-lg font-bold text-secondary-foreground shadow-lg shadow-secondary/20">
               F
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
               {BRAND.name}
            </span>
         </Link>
         <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
            {BRAND.tagline}
         </p>
         <NewsletterForm />
      </div>
   );
}

function ContactColumn() {
   return (
      <div className="lg:col-span-3">
         <FooterSectionHeading>تواصل معنا</FooterSectionHeading>
         <ul className="mt-5 space-y-3 text-sm">
            <li>
               <ContactItem
                  icon={Phone}
                  href={`tel:${CONTACT.phoneTel}`}
                  valueDir="ltr"
               >
                  {CONTACT.phoneDisplay}
               </ContactItem>
            </li>
            <li>
               <ContactItem
                  icon={Mail}
                  href={`mailto:${CONTACT.email}`}
                  valueDir="ltr"
               >
                  {CONTACT.email}
               </ContactItem>
            </li>
            <li>
               <ContactItem icon={MapPin}>{CONTACT.area}</ContactItem>
            </li>
         </ul>
      </div>
   );
}

function BottomBar({ year }: { year: number }) {
   return (
      <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
         <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-xs text-white/50 sm:text-sm">
               © {year} {BRAND.name}. جميع الحقوق محفوظة.
            </p>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <p className="inline-flex items-center gap-1.5 text-xs text-white/50">
               <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
               </span>
               جميع الأنظمة تعمل
            </p>
         </div>

         <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
               <SocialButton key={social.name} {...social} />
            ))}
         </div>
      </div>
   );
}

function BackdropLayers() {
   return (
      <>
         {/* Base depth gradient */}
         <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-[#0c1838] via-[#0a1530] to-[#050b1d]"
         />

         {/* Primary radial — top right */}
         <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
               backgroundImage:
                  'radial-gradient(800px 420px at 88% 0%, color-mix(in oklch, var(--primary) 38%, transparent), transparent 65%)',
            }}
         />

         {/* Secondary gold accent — bottom left */}
         <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
               backgroundImage:
                  'radial-gradient(500px 320px at 8% 100%, color-mix(in oklch, var(--secondary) 14%, transparent), transparent 60%)',
            }}
         />

         {/* Subtle grid */}
         <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-[0.04]"
            style={{
               backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage:
                  'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            }}
         />

         {/* Top hairline separator */}
         <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
         />
      </>
   );
}

export function FooterContent() {
   const year = new Date().getFullYear();

   return (
      <section className="relative isolate overflow-hidden bg-[#0a1530] text-white">
         <BackdropLayers />

         <div className="container mx-auto px-4 pb-10 pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
               <BrandColumn />
               <div className="lg:col-span-2">
                  <FooterLinkColumn title="روابط" links={QUICK_LINKS} />
               </div>
               <div className="lg:col-span-2">
                  <FooterLinkColumn title="قانوني" links={LEGAL_LINKS} />
               </div>
               <ContactColumn />
            </div>

            <BottomBar year={year} />
         </div>
      </section>
   );
}
