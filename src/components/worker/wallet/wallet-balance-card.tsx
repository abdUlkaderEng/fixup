'use client';

import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSAR } from '@/lib/format';

export interface WalletBalanceCardProps {
   balance: number;
   totalCharged: number;
   totalSpent: number;
   status?: string;
   isLoading?: boolean;
}

/**
 * Hero balance card for the worker wallet page.
 *
 * Visual hierarchy: big balance up top, with two compact "in / out" tiles
 * underneath for total_charged and total_spent. Matches the worker theme
 * (uses secondary tones via the worker-dashboard-shell class on the parent).
 */
export function WalletBalanceCard({
   balance,
   totalCharged,
   totalSpent,
   status,
   isLoading = false,
}: WalletBalanceCardProps) {
   return (
      <section
         data-dashboard-theme="worker"
         className={cn(
            'app-section-panel worker-dashboard-hero border-secondary/10 overflow-hidden'
         )}
      >
         <div className="flex flex-col gap-6">
            {/* Top: icon + label + status */}
            <div className="flex items-start justify-between gap-3">
               <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/16 text-secondary shadow-sm backdrop-blur-sm">
                     <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                     <p className="text-sm text-foreground/70">رصيد المحفظة</p>
                     <p className="text-xs text-foreground/55">
                        المبلغ المتاح لقبول الطلبات
                     </p>
                  </div>
               </div>
               {status && (
                  <span
                     className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium border',
                        status === 'active'
                           ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                           : 'border-border bg-background text-muted-foreground'
                     )}
                  >
                     {status === 'active' ? 'نشطة' : status}
                  </span>
               )}
            </div>

            {/* Balance */}
            <div className="flex items-baseline gap-2">
               {isLoading ? (
                  <Loader2 className="h-7 w-7 animate-spin text-secondary" />
               ) : (
                  <span className="text-4xl font-bold text-foreground sm:text-5xl">
                     {formatSAR(balance)}
                  </span>
               )}
               <span className="text-base font-medium text-foreground/70 sm:text-lg">
                  ل.س
               </span>
            </div>

            {/* In / Out tiles */}
            <div className="grid gap-3 sm:grid-cols-2">
               <BalanceStat
                  tone="positive"
                  icon={<ArrowDownLeft className="h-4 w-4" />}
                  label="إجمالي الشحن"
                  value={totalCharged}
                  isLoading={isLoading}
               />
               <BalanceStat
                  tone="negative"
                  icon={<ArrowUpRight className="h-4 w-4" />}
                  label="إجمالي الخصم"
                  value={totalSpent}
                  isLoading={isLoading}
               />
            </div>
         </div>
      </section>
   );
}

interface BalanceStatProps {
   tone: 'positive' | 'negative';
   icon: React.ReactNode;
   label: string;
   value: number;
   isLoading?: boolean;
}

function BalanceStat({
   tone,
   icon,
   label,
   value,
   isLoading,
}: BalanceStatProps) {
   const toneClasses =
      tone === 'positive'
         ? 'border-emerald-500/15 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
         : 'border-rose-500/15 bg-rose-500/5 text-rose-700 dark:text-rose-400';

   return (
      <div
         className={cn(
            'flex items-center gap-3 rounded-2xl border p-3 backdrop-blur-sm',
            toneClasses
         )}
      >
         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/60">
            {icon}
         </div>
         <div className="min-w-0">
            <p className="text-xs text-foreground/70">{label}</p>
            <p className="text-lg font-semibold text-foreground">
               {isLoading ? '—' : `${formatSAR(value)} ل.س`}
            </p>
         </div>
      </div>
   );
}
