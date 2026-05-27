'use client';

import { useState, type FormEvent } from 'react';
import { BadgeCheck, Mail, Send } from 'lucide-react';

const SUCCESS_TIMEOUT_MS = 3000;

export function NewsletterForm() {
   const [email, setEmail] = useState('');
   const [subscribed, setSubscribed] = useState(false);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email.trim()) return;
      setSubscribed(true);
      setEmail('');
      window.setTimeout(() => setSubscribed(false), SUCCESS_TIMEOUT_MS);
   };

   return (
      <form onSubmit={handleSubmit} className="mt-7 max-w-md">
         <label
            htmlFor="footer-newsletter"
            className="block text-sm font-semibold text-white"
         >
            اشترك بالنشرة البريدية
         </label>
         <p className="mt-1 text-xs text-white/50">
            تحديثات الخدمات الجديدة والعروض الحصرية مباشرة في بريدك.
         </p>

         <div className="mt-3 flex items-stretch gap-2">
            <div className="relative flex-1">
               <Mail className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
               <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pe-3 ps-10 text-sm text-white placeholder:text-white/40 transition-all focus:border-secondary/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-secondary/20"
               />
            </div>
            <button
               type="submit"
               className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-lg shadow-secondary/20 transition-all hover:bg-secondary/90 hover:shadow-xl hover:shadow-secondary/30 active:translate-y-px"
            >
               <Send className="size-4" />
               <span className="hidden sm:inline">اشترك</span>
            </button>
         </div>

         {subscribed && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
               <BadgeCheck className="size-3.5" />
               تم الاشتراك بنجاح، شكراً لك!
            </div>
         )}
      </form>
   );
}
