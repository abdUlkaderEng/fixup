'use client';

import { useState } from 'react';
import { Briefcase, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CareerWithTimestamp } from '@/types/entities/career';
import type { JobFee } from '@/types/admin/wallet';

export interface JobFeeRowProps {
   career: CareerWithTimestamp;
   existing: JobFee | undefined;
   isSaving: boolean;
   onSave: (input: { fee: number; is_active: boolean }) => Promise<void>;
}

/**
 * One row per career. Renders the current fee + active toggle and
 * commits changes via onSave when the admin clicks "حفظ".
 *
 * Dirty state is tracked locally so the save button only enables when
 * there's something to write back.
 */
export function JobFeeRow({
   career,
   existing,
   isSaving,
   onSave,
}: JobFeeRowProps) {
   const [feeInput, setFeeInput] = useState<string>(
      existing ? String(existing.fee) : ''
   );
   const [isActive, setIsActive] = useState<boolean>(
      existing ? existing.is_active : true
   );

   // Sync local form state when the server fee changes (e.g. GET resolves
   // after mount). React-recommended pattern: compare-during-render with
   // tracked prev value, avoiding the setState-in-effect anti-pattern.
   const [lastExistingKey, setLastExistingKey] = useState<string | null>(
      existing ? `${existing.id}:${existing.updated_at}` : null
   );
   const nextKey = existing ? `${existing.id}:${existing.updated_at}` : null;
   if (nextKey !== lastExistingKey) {
      setLastExistingKey(nextKey);
      setFeeInput(existing ? String(existing.fee) : '');
      setIsActive(existing ? existing.is_active : true);
   }

   const parsedFee = Number(feeInput);
   const isValid =
      feeInput.trim() !== '' && Number.isFinite(parsedFee) && parsedFee > 0;

   const isDirty = existing
      ? parsedFee !== existing.fee || isActive !== existing.is_active
      : feeInput.trim() !== '';

   const canSave = isValid && isDirty && !isSaving;

   const handleSave = async () => {
      if (!canSave) return;
      try {
         await onSave({ fee: parsedFee, is_active: isActive });
      } catch {
         // Toasted by hook
      }
   };

   return (
      <div className="admin-panel p-4">
         <div className="flex items-center gap-3 mb-3">
            <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
               <Briefcase className="h-5 w-5 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
               <p className="font-medium admin-text truncate">{career.name}</p>
               <p className="text-xs admin-text-muted">
                  {existing
                     ? `الرسوم الحالية: ${existing.fee} ر.س`
                     : 'لم يتم تعيين رسوم بعد'}
               </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
               <span className="text-xs admin-text-muted">
                  {isActive ? 'مفعّل' : 'معطّل'}
               </span>
               <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isSaving}
                  aria-label="حالة التفعيل"
               />
            </div>
         </div>

         <div className="flex items-center gap-2">
            <div className="relative flex-1">
               <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={feeInput}
                  onChange={(e) => setFeeInput(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') handleSave();
                  }}
                  placeholder="أدخل الرسوم..."
                  disabled={isSaving}
                  className={cn(
                     'admin-input h-10 pl-14',
                     !isValid &&
                        feeInput.trim() !== '' &&
                        'border-destructive focus-visible:border-destructive'
                  )}
               />
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs admin-text-muted pointer-events-none">
                  ر.س
               </span>
            </div>
            <Button
               size="sm"
               className="admin-btn-primary h-10 px-4 gap-2"
               onClick={handleSave}
               disabled={!canSave}
            >
               {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                  <Check className="h-4 w-4" />
               )}
               <span>حفظ</span>
            </Button>
         </div>
      </div>
   );
}
