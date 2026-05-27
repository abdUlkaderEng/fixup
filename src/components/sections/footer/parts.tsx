import { type ComponentType, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import {
   SOCIAL_PATHS,
   type FooterLinkItem,
   type SocialLink,
   type SocialName,
} from './data';

/** Footer link with a hover arrow that slides in from the right. */
export function FooterLink({ href, label }: FooterLinkItem) {
   return (
      <Link
         href={href}
         className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
      >
         {label}
         <ArrowLeft className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Link>
   );
}

interface FooterLinkColumnProps {
   title: string;
   links: FooterLinkItem[];
}

/** Titled column rendering a vertical list of footer links. */
export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
   return (
      <div>
         <FooterSectionHeading>{title}</FooterSectionHeading>
         <ul className="mt-5 space-y-3.5">
            {links.map((link) => (
               <li key={`${link.href}::${link.label}`}>
                  <FooterLink {...link} />
               </li>
            ))}
         </ul>
      </div>
   );
}

/** Uppercase column heading used across footer columns. */
export function FooterSectionHeading({ children }: { children: ReactNode }) {
   return (
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
         {children}
      </h3>
   );
}

interface ContactItemProps {
   icon: ComponentType<{ className?: string }>;
   children: ReactNode;
   /** Renders the row as a clickable link (tel:/mailto:) when provided. */
   href?: string;
   /** Force value text direction (useful for LTR phone/email inside RTL footer). */
   valueDir?: 'ltr' | 'rtl';
}

const CHIP_BASE =
   'flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]';
const CHIP_INTERACTIVE =
   'transition-all group-hover:border-secondary/40 group-hover:bg-secondary/15 group-hover:text-secondary';

/** Contact row: icon chip + label, optionally wrapped in a tel:/mailto: anchor. */
export function ContactItem({
   icon: Icon,
   children,
   href,
   valueDir,
}: ContactItemProps) {
   const inner = (
      <>
         <span className={`${CHIP_BASE} ${href ? CHIP_INTERACTIVE : ''}`}>
            <Icon className="size-3.5" />
         </span>
         <span dir={valueDir}>{children}</span>
      </>
   );

   if (href) {
      return (
         <a
            href={href}
            className="group flex items-center gap-3 text-white/70 transition-colors hover:text-white"
         >
            {inner}
         </a>
      );
   }

   return <div className="flex items-center gap-3 text-white/70">{inner}</div>;
}

/** Renders one of the bundled brand SVGs by name. */
export function SocialIcon({ name }: { name: SocialName }) {
   return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
         <path d={SOCIAL_PATHS[name]} />
      </svg>
   );
}

/** Square icon button for a social link. */
export function SocialButton({ name, label, href }: SocialLink) {
   return (
      <a
         href={href}
         aria-label={label}
         className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-secondary/15 hover:text-secondary"
      >
         <SocialIcon name={name} />
      </a>
   );
}
