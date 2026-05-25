'use client';

const STATUS_LABELS: Record<string, string> = {
   pending: 'قيد المراجعة',
   accepted: 'مقبول',
   rejected: 'مرفوض',
};

const STATUS_COLORS: Record<string, string> = {
   pending: 'bg-amber-50 text-amber-700 border-amber-200',
   accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
   rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function OfferStatusBadge({ status }: { status: string }) {
   return (
      <span
         className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground border-border'}`}
      >
         {STATUS_LABELS[status] ?? status}
      </span>
   );
}
