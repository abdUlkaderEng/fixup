'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusVariant =
   | 'default'
   | 'active'
   | 'inactive'
   | 'pending'
   | 'approved'
   | 'rejected'
   | 'success'
   | 'warning'
   | 'error'
   | 'info';

interface StatusBadgeProps {
   status: StatusVariant;
   label: string;
   className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
   default: 'bg-secondary text-secondary-foreground',
   active: 'bg-emerald-50 text-emerald-700',
   inactive: 'bg-gray-100 text-gray-600',
   pending: 'bg-[#f8c617]/20 text-yellow-700',
   approved: 'bg-emerald-50 text-emerald-700',
   rejected: 'bg-[#e62223]/10 text-[#e62223]',
   success: 'bg-emerald-50 text-emerald-700',
   warning: 'bg-[#f8c617]/20 text-yellow-700',
   error: 'bg-[#e62223]/10 text-[#e62223]',
   info: 'bg-[#13377b]/10 text-[#13377b]',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
   return (
      <Badge
         variant="secondary"
         className={cn(
            'font-medium px-2.5 py-0.5',
            statusStyles[status],
            className
         )}
      >
         {label}
      </Badge>
   );
}

export interface StatusConfig {
   label: string;
   variant: StatusVariant;
}

export function useStatusBadge(config: Record<string, StatusConfig>) {
   return (key: string): StatusConfig => {
      return config[key] || { label: key, variant: 'default' };
   };
}
