'use client';

interface SidebarIdentityCardProps {
   workerName: string;
}

export function SidebarIdentityCard({ workerName }: SidebarIdentityCardProps) {
   const initial = workerName.charAt(0).toUpperCase();
   return (
      <div className="border-b border-border/40 px-4 py-4">
         <div className="worker-identity-card flex items-center gap-3 rounded-xl px-2 py-2.5">
            <div className="worker-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm">
               {initial}
            </div>
            <div className="min-w-0">
               <p className="truncate text-sm font-semibold text-foreground">
                  {workerName}
               </p>
               <p className="text-[11px] font-medium text-primary">فني معتمد</p>
            </div>
         </div>
      </div>
   );
}
