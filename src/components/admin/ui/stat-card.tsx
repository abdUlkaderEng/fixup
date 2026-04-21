'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StatCardProps } from '@/types/admin';

/**
 * Statistic card component
 * Displays a metric with trend indicator
 */
export function StatCard({
   title,
   value,
   change,
   trend,
   icon: Icon,
   description,
}: StatCardProps) {
   const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
   const trendColor =
      trend === 'up'
         ? 'text-emerald-600'
         : trend === 'down'
           ? 'text-red-600'
           : 'text-gray-500';

   return (
      <Card className="admin-panel text-gray-900 shadow-none">
         <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium admin-text-muted">
               {title}
            </CardTitle>
            <Icon className="h-4 w-4 admin-text-subtle" />
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-bold admin-text">{value}</div>
            <p className="text-xs admin-text-muted mt-1">{description}</p>
            <div
               className={cn(
                  'flex items-center gap-1 mt-2 text-xs',
                  trendColor
               )}
            >
               <TrendIcon className="h-3 w-3" />
               <span>{change}</span>
            </div>
         </CardContent>
      </Card>
   );
}
