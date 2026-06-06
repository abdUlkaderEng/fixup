'use client';

import { useHomepageStatistics } from '@/hooks/public';
import { CountUp } from './count-up';

interface DisplayStat {
   key: string;
   label: string;
   /** Animated numeric value (customers / workers). */
   value?: number;
   /** Rendered before an animated value (e.g. "+"). */
   prefix?: string;
   /** Static, non-numeric value (e.g. "24/7"). */
   staticValue?: string;
}

export function StatsStrip() {
   const { statistics } = useHomepageStatistics();

   const stats: DisplayStat[] = [
      {
         key: 'users',
         value: statistics?.users_count ?? 0,
         prefix: '+',
         label: 'عميل',
      },
      {
         key: 'workers',
         value: statistics?.workers_count ?? 0,
         prefix: '+',
         label: 'فني معتمد',
      },
      { key: 'support', staticValue: '24/7', label: 'دعم متواصل' },
   ];

   return (
      <div className="mt-5 grid max-w-md grid-cols-3 gap-15 sm:gap-14">
         {stats.map((stat, index) => (
            <div
               key={stat.key}
               className="animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-700"
               style={{ animationDelay: `${index * 120}ms` }}
            >
               <div className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.staticValue !== undefined ? (
                     stat.staticValue
                  ) : (
                     <CountUp value={stat.value ?? 0} prefix={stat.prefix} />
                  )}
               </div>
               <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
               </div>
            </div>
         ))}
      </div>
   );
}

export default StatsStrip;
