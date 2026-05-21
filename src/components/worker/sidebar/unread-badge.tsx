'use client';

interface UnreadBadgeProps {
   count: number;
   inline: boolean;
}

export function UnreadBadge({ count, inline }: UnreadBadgeProps) {
   if (count === 0) return null;
   const label = count > 99 ? '99+' : count;
   return inline ? (
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
         {label}
      </span>
   ) : (
      <span className="absolute top-1.5 left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
         {label}
      </span>
   );
}
