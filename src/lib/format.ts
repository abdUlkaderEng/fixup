/**
 * Shared formatting helpers used across customer / worker / admin UIs.
 * Arabic locale by default so numbers and dates render correctly in RTL.
 */

const SAR_FORMATTER = new Intl.NumberFormat('ar-SA', {
   maximumFractionDigits: 2,
   minimumFractionDigits: 0,
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('ar-SA', {
   dateStyle: 'medium',
   timeStyle: 'short',
});

/**
 * Format a SAR amount with Arabic digit grouping (no symbol).
 * Caller is expected to render the "ر.س" label next to it where appropriate.
 *
 * @example
 *   formatSAR(10850)  // → "١٠٬٨٥٠"
 */
export function formatSAR(amount: number): string {
   if (!Number.isFinite(amount)) return '٠';
   return SAR_FORMATTER.format(amount);
}

/**
 * Format an ISO timestamp as a localized Arabic date+time string.
 * Returns an em dash for null / invalid input.
 */
export function formatDateTime(iso: string | null | undefined): string {
   if (!iso) return '—';
   const date = new Date(iso);
   if (Number.isNaN(date.getTime())) return '—';
   return DATETIME_FORMATTER.format(date);
}
