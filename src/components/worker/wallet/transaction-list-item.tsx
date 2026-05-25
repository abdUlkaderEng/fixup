'use client';

import { ArrowDownLeft, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime, formatSAR } from '@/lib/format';
import type {
   WorkerWalletTransaction,
   WalletTransactionType,
} from '@/types/worker/wallet';

interface TransactionVisual {
   icon: LucideIcon;
   label: string;
   /** Sign in front of the amount. Topup → "+", job_fee → "-". */
   sign: '+' | '-';
   amountClass: string;
   iconClass: string;
}

const TRANSACTION_VISUALS: Record<string, TransactionVisual> = {
   topup: {
      icon: ArrowDownLeft,
      label: 'شحن',
      sign: '+',
      amountClass: 'text-emerald-700 dark:text-emerald-400',
      iconClass:
         'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/15',
   },
   job_fee: {
      icon: ArrowUpRight,
      label: 'رسوم طلب',
      sign: '-',
      amountClass: 'text-rose-700 dark:text-rose-400',
      iconClass:
         'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/15',
   },
};

const FALLBACK_VISUAL: TransactionVisual = {
   icon: ArrowUpRight,
   label: 'حركة',
   sign: '-',
   amountClass: 'text-foreground',
   iconClass: 'bg-muted text-muted-foreground border-border',
};

function getVisual(type: WalletTransactionType): TransactionVisual {
   return TRANSACTION_VISUALS[type] ?? FALLBACK_VISUAL;
}

export interface TransactionListItemProps {
   transaction: WorkerWalletTransaction;
}

/**
 * Single transaction row.
 *
 * Layout: typed icon | label + note + date (stacked) | signed amount + balance after.
 */
export function TransactionListItem({ transaction }: TransactionListItemProps) {
   const visual = getVisual(transaction.type);
   const Icon = visual.icon;

   return (
      <article className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-secondary/30">
         {/* Type icon */}
         <div
            className={cn(
               'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border',
               visual.iconClass
            )}
         >
            <Icon className="h-5 w-5" />
         </div>

         {/* Label + note + date */}
         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <span className="text-sm font-semibold text-foreground">
                  {visual.label}
               </span>
               {transaction.reference_id && (
                  <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                     #{transaction.reference_id}
                  </span>
               )}
            </div>
            {transaction.note && (
               <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {transaction.note}
               </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground/80">
               {formatDateTime(transaction.created_at)}
            </p>
         </div>

         {/* Amount + balance after */}
         <div className="text-left">
            <p
               className={cn(
                  'text-base font-bold tabular-nums',
                  visual.amountClass
               )}
            >
               {visual.sign}
               {formatSAR(transaction.amount)} ل.س
            </p>
            <p className="text-[11px] text-muted-foreground">
               الرصيد بعد:{' '}
               <span className="tabular-nums">
                  {formatSAR(transaction.balance_after)}
               </span>
            </p>
         </div>
      </article>
   );
}
