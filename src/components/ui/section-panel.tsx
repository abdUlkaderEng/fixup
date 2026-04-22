import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionPanelProps {
   title?: string;
   icon?: ReactNode;
   children: ReactNode;
   className?: string;
}

export function SectionPanel({
   title,
   icon,
   children,
   className,
}: SectionPanelProps) {
   return (
      <section className={cn('app-section-panel', className)}>
         {title ? (
            <div className="app-section-header">
               {icon ? <span className="text-primary">{icon}</span> : null}
               <h2 className="app-section-title">{title}</h2>
            </div>
         ) : null}
         {children}
      </section>
   );
}

export default SectionPanel;
