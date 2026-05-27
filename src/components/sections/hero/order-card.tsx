import {
   CheckCircle2,
   Clock,
   MapPin,
   Sparkles,
   Star,
   Wrench,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';

import { MOCK_ORDER } from './data';

function DetailRow({
   label,
   icon: Icon,
   value,
}: {
   label: string;
   icon?: ComponentType<{ className?: string }>;
   value: ReactNode;
}) {
   return (
      <div className="flex items-center justify-between text-sm">
         <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            {Icon && <Icon className="size-3.5" />}
            {label}
         </span>
         <span className="font-medium text-foreground">{value}</span>
      </div>
   );
}

/** Mock "live order" card shown as the hero's product preview. */
export function OrderCard() {
   return (
      <div className="relative z-10 w-[320px] rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-primary/10 ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/5">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
               <span className="size-1.5 rounded-full bg-emerald-500" />
               {MOCK_ORDER.status}
            </div>
            <Sparkles className="size-4 text-secondary" />
         </div>

         {/* Worker */}
         <div className="mt-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
               <Wrench className="size-5 text-primary" />
            </div>
            <div className="text-right">
               <div className="text-sm font-bold text-foreground">
                  {MOCK_ORDER.workerName}
               </div>
               <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-secondary text-secondary" />
                  <span>{MOCK_ORDER.workerSubtitle}</span>
               </div>
            </div>
         </div>

         <div className="my-4 h-px bg-border" />

         {/* Details */}
         <div className="space-y-3">
            <DetailRow label="الخدمة" value={MOCK_ORDER.service} />
            <DetailRow
               label="الموقع"
               icon={MapPin}
               value={MOCK_ORDER.location}
            />
            <DetailRow label="الوصول" icon={Clock} value={MOCK_ORDER.eta} />
         </div>

         {/* Progress */}
         <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
               <span className="text-muted-foreground">حالة الطلب</span>
               <span className="font-semibold text-primary">
                  {MOCK_ORDER.progressPct}%
               </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
               <div
                  className="h-full rounded-full bg-linear-to-l from-primary to-secondary"
                  style={{ width: `${MOCK_ORDER.progressPct}%` }}
               />
            </div>
         </div>

         {/* Confirmation */}
         <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            {MOCK_ORDER.confirmation}
         </div>
      </div>
   );
}
