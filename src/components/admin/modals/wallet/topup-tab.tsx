'use client';

import { useCallback, useState } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WorkerPicker } from '@/components/admin/ui';
import { useWalletTopup } from '@/hooks/admin';
import { cn } from '@/lib/utils';
import type { Worker } from '@/types/entities/worker';

/**
 * Wallet top-up tab.
 *
 * Workflow:
 *  1. Pick a worker (career filter + search via WorkerPicker).
 *  2. Enter amount (positive number) + note (required).
 *  3. Submit → POST /admin/wallet/topup/{user_id}.
 *
 * Form resets after a successful top-up so admin can do another one
 * back-to-back without re-selecting filters.
 */
export function TopupTab() {
   const [worker, setWorker] = useState<Worker | null>(null);
   const [amount, setAmount] = useState<string>('');
   const [note, setNote] = useState<string>('');

   const { isTopupLoading, topup } = useWalletTopup({
      onSuccess: () => {
         // Reset form for the next top-up
         setAmount('');
         setNote('');
      },
   });

   const parsedAmount = Number(amount);
   const isAmountValid =
      amount.trim() !== '' && Number.isFinite(parsedAmount) && parsedAmount > 0;
   const isNoteValid = note.trim().length > 0;
   const canSubmit =
      !!worker && isAmountValid && isNoteValid && !isTopupLoading;

   const handleSubmit = useCallback(async () => {
      if (!canSubmit || !worker) return;
      try {
         await topup(worker.user_id, {
            amount: parsedAmount,
            note: note.trim(),
         });
      } catch {
         // Toasted by hook
      }
   }, [canSubmit, worker, parsedAmount, note, topup]);

   return (
      <div className="space-y-5">
         {/* Worker picker */}
         <WorkerPicker
            value={worker}
            onChange={setWorker}
            label="اختر العامل"
            disabled={isTopupLoading}
         />

         {/* Amount + note (only shown after worker is selected) */}
         {worker && (
            <div className="admin-panel p-4 space-y-4">
               {/* Amount */}
               <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                     المبلغ
                  </label>
                  <div className="relative">
                     <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="مثال: 1000"
                        disabled={isTopupLoading}
                        className={cn(
                           'admin-input h-11 pl-14',
                           amount.trim() !== '' &&
                              !isAmountValid &&
                              'border-destructive focus-visible:border-destructive'
                        )}
                     />
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs admin-text-muted pointer-events-none">
                        ر.س
                     </span>
                  </div>
                  {amount.trim() !== '' && !isAmountValid && (
                     <p className="text-xs text-destructive mt-1.5">
                        المبلغ يجب أن يكون أكبر من صفر
                     </p>
                  )}
               </div>

               {/* Note */}
               <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                     ملاحظة <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                     placeholder="سبب الشحن (مثال: شحن أولي للمحفظة)"
                     disabled={isTopupLoading}
                     rows={3}
                     className={cn(
                        'admin-input',
                        note.length > 0 &&
                           !isNoteValid &&
                           'border-destructive focus-visible:border-destructive'
                     )}
                  />
               </div>

               {/* Submit */}
               <Button
                  className="admin-btn-primary w-full h-11 gap-2"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
               >
                  {isTopupLoading ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Wallet className="h-4 w-4" />
                  )}
                  <span>
                     {isTopupLoading
                        ? 'جاري الشحن...'
                        : `شحن ${
                             isAmountValid ? `${parsedAmount} ر.س` : 'المحفظة'
                          }`}
                  </span>
               </Button>
            </div>
         )}
      </div>
   );
}
